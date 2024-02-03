import {Router} from "express"
import {Request, Response} from "express"

const grade = async(req: Request, res: Response) => {
    console.log("grade called")
    try {
        if (!req){
            throw new Error("No request given")
        }

        return res.status(201).json({
            success: true,
            message: "OK",
            grade: 50
        })
    } catch (err) {
        return res.status(200).json({
            success: false,
            message: err.message,
        })
    }
}

const appRouter = Router()
appRouter.post("/grade", grade)

export default appRouter
