import {Router} from "express"
import {Request, Response} from "express"

const grade = async(req: Request, res: Response) => {
    try {
        if (!req){
            throw new Error("No request given")
        }

        return res.status(201).json({
          message: "OK",
          score: "50",
        })
    } catch (err) {
        return res.status(200).json({
            message: err.message,
            score: "",
        })
    }
}

const appRouter = Router()
appRouter.post("/grade", grade)

export default appRouter
