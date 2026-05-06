'use strict';

class Service {
    constructor(name, price) {
        this._id = crypto.randomUUID();
        this._name = name;
        this._price = price;
        this._seatsReserved = [];
        this._seatsBooked = [];
    }
    getId() {
        return this._id;
    }
    getName() {
        return this._name;
    }
    getPrice() {
        return this._price;
    }
    setName(name) {
        this._name = name;
    }
    setPrice(price) {
        this._price = price;
    }
    getBookedSeats() {
        return this._seatsBooked;
    }
    getReservedSeats() {
        return this._seatsReserved;
    }
    addReservedSeat(seatId) {
        this._seatsReserved.push(seatId);
    }
    removeReservedSeat(seatId) {
        const index = this._seatsReserved.findIndex((id) => id === seatId);
        if (index !== -1) {
            this._seatsReserved.splice(index, 1);
        }
    }
    clearReservedSeats() {
        this._seatsReserved = [];
    }
    setBookedSeatsArray(array) {
        this._seatsBooked = array;
    }
    bookSeats() {
        const reservedSeats = this.getReservedSeats();
        reservedSeats.forEach((seatId) => {
            this._seatsBooked.push(seatId);
        });
        this.clearReservedSeats();
    }
}

module.exports = Service;