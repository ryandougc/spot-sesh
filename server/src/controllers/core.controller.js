export const getBaseRoute = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Hello World"
    })
}