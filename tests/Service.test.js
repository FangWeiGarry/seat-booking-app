'use strict';

global.crypto = {
    randomUUID: () => Math.random().toString(36).substring(2)
};

const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
        removeItem: (key) => { delete store[key]; }
    };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

const Service = require('../script/Service');

beforeEach(() => {
    localStorage.clear();
});

describe('addReservedSeat', () => {
    test('should add a seat ID to reserved seats', () => {
        const service = new Service('Test', 10);
        service.addReservedSeat('s-A1-1-1');
        expect(service.getReservedSeats()).toContain('s-A1-1-1');
    });

    test('should add multiple seat IDs', () => {
        const service = new Service('Test', 10);
        service.addReservedSeat('s-A1-1-1');
        service.addReservedSeat('s-A1-1-2');
        expect(service.getReservedSeats()).toHaveLength(2);
    });

    test('should store seat as string not DOM element', () => {
        const service = new Service('Test', 10);
        service.addReservedSeat('s-A1-1-3');
        expect(typeof service.getReservedSeats()[0]).toBe('string');
    });
});

describe('removeReservedSeat', () => {
    test('should remove correct seat by ID', () => {
        const service = new Service('Test', 10);
        service.addReservedSeat('s-A1-1-1');
        service.addReservedSeat('s-A1-1-2');
        service.removeReservedSeat('s-A1-1-1');
        expect(service.getReservedSeats()).not.toContain('s-A1-1-1');
        expect(service.getReservedSeats()).toContain('s-A1-1-2');
    });

    test('BUG FIX: should not delete last element when ID not found', () => {
        const service = new Service('Test', 10);
        service.addReservedSeat('s-A1-1-1');
        service.addReservedSeat('s-A1-1-2');
        service.removeReservedSeat('non-existent-id');
        expect(service.getReservedSeats()).toHaveLength(2);
    });

    test('should return empty array after removing only seat', () => {
        const service = new Service('Test', 10);
        service.addReservedSeat('s-A1-1-1');
        service.removeReservedSeat('s-A1-1-1');
        expect(service.getReservedSeats()).toHaveLength(0);
    });

    test('should not throw when removing from empty array', () => {
        const service = new Service('Test', 10);
        expect(() => service.removeReservedSeat('s-A1-1-1')).not.toThrow();
    });

    test('should remove seat from middle of array', () => {
        const service = new Service('Test', 10);
        service.addReservedSeat('s-A1-1-1');
        service.addReservedSeat('s-A1-1-2');
        service.addReservedSeat('s-A1-1-3');
        service.removeReservedSeat('s-A1-1-2');
        expect(service.getReservedSeats()).toEqual(['s-A1-1-1', 's-A1-1-3']);
    });
});

describe('bookSeats', () => {
    test('should move reserved seats to booked seats', () => {
        const service = new Service('Test', 10);
        service.addReservedSeat('s-A1-1-1');
        service.addReservedSeat('s-A1-1-2');
        service.bookSeats();
        expect(service.getBookedSeats()).toContain('s-A1-1-1');
        expect(service.getBookedSeats()).toContain('s-A1-1-2');
    });

    test('should clear reserved seats after booking', () => {
        const service = new Service('Test', 10);
        service.addReservedSeat('s-A1-1-1');
        service.bookSeats();
        expect(service.getReservedSeats()).toHaveLength(0);
    });

    test('should store seat IDs not DOM elements in booked array', () => {
        const service = new Service('Test', 10);
        service.addReservedSeat('s-A1-1-1');
        service.bookSeats();
        expect(typeof service.getBookedSeats()[0]).toBe('string');
    });

    test('booking with no reserved seats should result in empty booked array', () => {
        const service = new Service('Test', 10);
        service.bookSeats();
        expect(service.getBookedSeats()).toHaveLength(0);
    });
});

describe('clearReservedSeats', () => {
    test('should clear all reserved seats', () => {
        const service = new Service('Test', 10);
        service.addReservedSeat('s-A1-1-1');
        service.addReservedSeat('s-A1-1-2');
        service.clearReservedSeats();
        expect(service.getReservedSeats()).toHaveLength(0);
    });

    test('should not throw when clearing empty array', () => {
        const service = new Service('Test', 10);
        expect(() => service.clearReservedSeats()).not.toThrow();
    });

    test('should allow adding seats after clearing', () => {
        const service = new Service('Test', 10);
        service.addReservedSeat('s-A1-1-1');
        service.clearReservedSeats();
        service.addReservedSeat('s-A1-1-2');
        expect(service.getReservedSeats()).toEqual(['s-A1-1-2']);
    });
});

describe('Integration', () => {
    test('full booking flow: add -> book -> clear', () => {
        const service = new Service('Test', 10);
        service.addReservedSeat('s-A1-1-1');
        service.addReservedSeat('s-A1-1-2');
        expect(service.getReservedSeats()).toHaveLength(2);
        service.bookSeats();
        expect(service.getBookedSeats()).toHaveLength(2);
        expect(service.getReservedSeats()).toHaveLength(0);
    });

    test('add, remove, then book remaining seat', () => {
        const service = new Service('Test', 10);
        service.addReservedSeat('s-A1-1-1');
        service.addReservedSeat('s-A1-1-2');
        service.removeReservedSeat('s-A1-1-1');
        service.bookSeats();
        expect(service.getBookedSeats()).toEqual(['s-A1-1-2']);
    });

    test('getName and getPrice return correct values', () => {
        const service = new Service('Evening Show', 25);
        expect(service.getName()).toBe('Evening Show');
        expect(service.getPrice()).toBe(25);
    });

    test('setName and setPrice update correctly', () => {
        const service = new Service('Old Name', 10);
        service.setName('New Name');
        service.setPrice(20);
        expect(service.getName()).toBe('New Name');
        expect(service.getPrice()).toBe(20);
    });

    test('setBookedSeatsArray sets array correctly', () => {
        const service = new Service('Test', 10);
        service.setBookedSeatsArray(['s-A1-1-1', 's-A1-1-2']);
        expect(service.getBookedSeats()).toEqual(['s-A1-1-1', 's-A1-1-2']);
    });
});