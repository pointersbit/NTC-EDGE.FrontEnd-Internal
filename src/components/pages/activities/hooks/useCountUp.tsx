import { useState, useEffect } from "react"

const getProgress = (elapsed, duration) => Math.min(elapsed / duration, 1)
const easeOut = progress => Math.pow(progress - 1, 5) + 1

export default function useCountUp(duration, onRest?:any) {
    const [value, setValue] = useState(0)

    useEffect(() => {
        let start = performance.now()
        let elapsed = 0
        let frame

        const tick = now => {
            elapsed = now - start
            const progress = getProgress(elapsed, duration)
            setValue(easeOut(progress))
            if (progress < 1) {
                frame = requestAnimationFrame(tick)
            } else {
                onRest && onRest()
            }
        }

        frame = requestAnimationFrame(tick)

        return () => cancelAnimationFrame(frame)
    }, [duration, onRest])

    return value
}
