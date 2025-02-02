
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";

import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";

const QuantityBox = (props) => {
    const [inputVal, setInputVal] = useState(1);
    const context = useContext(MyContext);
    useEffect(() => {
        if (props?.value !== undefined && props?.value !== null && props?.value !== "") {
            setInputVal(parseInt(props?.value))
        }
        context.getCartData();
    }, [props.value])

    useEffect(() => {
        if (props.quantity) {
            props.quantity(inputVal)
        }

        if (props.selectedItem) {
            props.selectedItem(props.item, inputVal);
        }

    }, [inputVal]);
    
    const minus = () => {
        if (inputVal !== 1 && inputVal > 0) {
            setInputVal(inputVal - 1);
        }
    }

    const plus = () => {
        setInputVal(inputVal + 1);
    }


    return (
        <div className="flex items-center space-x-4">
            <button
                onClick={minus}
                className="w-10 h-10 flex items-center justify-center bg-gray-200 text-black rounded-full hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
            >
                <FaMinus />
            </button>
            <input
                type="text"
                value={inputVal}
                readOnly
                className="w-10 text-center border border-gray-300 rounded-md text-lg font-semibold text-black focus:outline-none"
            />
            <button
                onClick={plus}
                className="w-10 h-10 flex items-center justify-center bg-gray-200 text-black rounded-full hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
            >
                <FaPlus />
            </button>
        </div>

    )
}

export default QuantityBox;