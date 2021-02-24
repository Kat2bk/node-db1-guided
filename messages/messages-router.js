const express = require("express")
const db = require("../data/config")

const router = express.Router()

router.get("/", async (req, res, next) => {
	try {
		// translates to `SELECT * FROM messages;`
		const messages = await db.select("*").from("messages")
		res.json(messages)
	} catch (err) {
		next(err)
	}
})

router.get("/:id", async (req, res, next) => {
	try {
		// translates to `SELECT * FROM messages WHERE id = ? LIMIT 1;`
		const [message] = await db
			.select("*")
			.from("messages")
			.where("id", req.params.id)
			.limit(1)

		res.json(message)
	} catch (err) {
		next(err)
	}
})

router.post("/", async (req, res, next) => {
	try {
		// translates to `INSERT INTO messages (title, contents) VALUES(?, ?);`
		const [id] = await db
			.insert({
				title: req.body.title,
				contents: req.body.contents,
			})
			.into("messages")

		const message = await db("messages")
			.where("id", id)
			.first()

		res.status(201).json(message)
	} catch (err) {
		next(err)
	}
})

router.put("/:id", async (req, res, next) => {
	try {
		// translates to `UPDATE messages SET title = ? AND contents = ? WHERE id = ?;`
		await db("messages")
			.where("id", req.params.id)
			.update({
				title: req.body.title,
				contents: req.body.contents,
			})

		const message = await db("messages")
			.where("id", req.params.id)
			.first()

		res.json(message)
	} catch (err) {
		next(err)
	}
})

router.delete("/:id", async (req, res, next) => {
	try {
		// translates to `DELETE FROM messages WHERE id = ?;`
		await db("messages")
			.where("id", req.params.id)
			.delete()

		res.status(204).end()
	} catch (err) {
		next(err)
	}
})

module.exports = router
