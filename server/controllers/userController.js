import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";

export const createUser = asyncHandler(async (req, res) => {
    let { email }  = req.body;
    const userExists = await prisma.user.findUnique({ where: { email: email }});
    if(!userExists) {
        const user = await prisma.user.create({ data: req.body });
        res.send({
            message: "User registered successfully",
            user: user,
        });
    } else {
        res.status(201).send({ message: "User already registered" });
    }
});

export const bookVisit = asyncHandler(async(req, res) => {
    const { email, date } = req.body;
    const { id } = req.params;
    
    try {
        const alreadyBooked = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisits: true }
        })
        if(alreadyBooked.bookedVisits.some((visit) => visit.id === id)){
            res.status(400).json({ message: "This residency is a already booked by you" });
        } else{
            await prisma.user.update({
                where:{ 
                    email: email
                 },
                 data: { bookedVisits: { push: { id, date } } }
            })
        }
        res.send("your visit is booked successfully");
    } catch (error) {
        throw new Error(error.message)
    }
});

export const getAllBookings = asyncHandler(async(req, res) => {
    const { email } = req.body;
    try {
        const bookings = await prisma.user.findUnique({
            where: { email }, 
            select: { bookedVisits: true }
        });
        res.status(200).send(bookings)
    } catch (error) {
        throw new Error(error.message);
    }
})

export const cancelBooking = asyncHandler(async(req, res) => {
    const { email } = req.body;
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
            select: {bookedVisits: true}
        });
        const index = user.bookedVisits.findIndex((visit) => visit.id === id);
        if(index === -1) {
           res.status(404).json({ message: "Booking not found" });
        } else {
            user.bookedVisits.splice(index, 1);
            await prisma.user.update({
                where: {email},
                data: { bookedVisits: user.bookedVisits }
            })
            res.send("Booking cancelled")
        }
    } catch (error) {
        throw new Error(error.message)
    }

})

// function to add a resd in favourite list of a user

export const toFav = asyncHandler(async(req,res) => {
    const { email } = req.body;
    const { rid } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if(user.favResidenciesID.includes(rid)) {
            const updateUser = await prisma.user.update({
                where: { email },
                data: {
                    favResidenciesID: {
                        set: user.favResidenciesID.filter((id) => id !== rid)
                    }
                }
            });
            res.send({ message: "Removed from favorites", user: updateUser })
        } else {
            const updateUser = await prisma.user.update({
                where: { email },
                data: {
                    favResidenciesID: {
                        push: rid
                    }
                }
            });
            res.send({ message: "Updated favorites", user: updateUser})
        }
    } catch (error) {
        throw new Error(error.message);
    }
})

// function to get all favourites

export const getAllFavorites = asyncHandler(async(req, res) => {
    const { email } = req.body;
    try {
        const favResd = await prisma.user.findUnique({
            where: {email},
            select: { favResidenciesID: true }
        });
        res.status(200).send(favResd);
    } catch (error) {
        throw new Error(error.message);
    }
})