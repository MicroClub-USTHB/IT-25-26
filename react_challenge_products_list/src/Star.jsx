import { useState } from "react"
import {FaStar} from "react-icons/fa"

const createArray = (length) => Array.from({ length }, (_, i) => i)

function Star({selected = false, onSelect = f => f}) {
    return(
        <FaStar color={selected ? "green" : "grey"} onClick={onSelect}/>
    )
}

export function SelectStar({totalStars = 5}) {
    const [selectedStars, setSelectedStars] = useState(3)
    return (
        <div>
            {createArray(totalStars).map((_, i) => (
                <Star 
                    key={i} 
                    selected={i < selectedStars}
                    onSelect={() => setSelectedStars(i+1)}
                />
            ))}
        </div>
    );
}


