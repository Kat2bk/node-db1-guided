const express = require("express")
const db = require("../data/config")

const router = express.Router()

router.get("/", async (req, res, next) => {
    try {
     const messages = await db.select("*").from("messages")
     res.json(messages)
    } catch (error) {
        next(err)
    }
})

router.get("/:id", async (req, res, next) => {
    try {
        const message = await db
        .select("*")
        .from("messages")
        .where("id", req.params.id)
        .limit(1)
        res.json(message)
    } catch (error) {
        next(error)
    }
})

router.post("/", async (req, res, next) => {
    try {

        //specify each value being sent to the database
        const payload = {
            title: req.body.title,
            contents: req.body.contents
        }

        const [id] = await db.insert(payload).into("messages")
        const message = await db("messages")
        .where("id", id)
        .first()

        res.status(201).json(message)
    } catch (error) {
        next(error)
    }
})

router.put("/:id", async (req, res, next) => {
    try {
        const payload = {
            title: req.body.title,
            contents: req.body.contents
        }

        //translates to 'UPDATE messages SET title = ? AND contents = ? WHERE id = ?
        await db("messages")
        .update(payload)
        .where("id", req.params.id)

        const message = await db("messages").where("id", req.params.id).first()

        res.json(message)

    } catch (error) {
        next(error)
    }
})

router.delete("/:id", async (req, res, next) => {
    try {

        //translate to DELETE FROM messages WHERE id = ?;
     await db("messages").where("id", req.params.id).del()

     res.status(204).end()
    } catch (error) {
        next(error)
    }
})

module.exports = router
