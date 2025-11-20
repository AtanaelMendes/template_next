import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { useCallback } from 'react';
import { cn } from '@/assets/utils';

export const CardActions = ({ children, align }) => {
    const position = {
        center: "text-center",
        right: "text-right",
        left: "text-left"
    }
    return (
        <div className={"inline-block w-full max-h-14 p-1 xl:p-2 border-t-2 "+position[(align || "left")]}>
            {children}
        </div>
    );
}

export const CardTitle = ({ children, primary, success, warning, danger, onClick, button }) => {
    const getColor = () => {
        let color = " ";
        if (primary) color = " bg-blue-600 text-white";
        if (success) color = " bg-green-500 text-white";
        if (warning) color = " bg-yellow-400";
        if (danger) color = " bg-red-600 text-white";

        return color;
    }

    const handleClick = () => {
        if (typeof onClick === "function") {
            onClick();
        }
    };

    return (
        <div className={`mb-2 text-lg xl:text-xl font-bold tracking-tight w-full p-1 xl:p-2 border-b-2 relative rounded-t-lg ${getColor()} h-fit`}>
            {button && <div className='float-right z-10 rounded-full p-1 hover:bg-drop-shadow-4 cursor-pointer drop-shadow' onClick={handleClick}>
                <FontAwesomeIcon icon={faEllipsisVertical} width="20" height="20" />
            </div>}
            <span className='drop-shadow'>
                {children}
            </span>
        </div>
    );
}

export const CardBody = ({ children }) => {
    return (
        <div className="flex flex-col w-full text-gray-700 p-1 xl:p-2">
            {children}
        </div>
    );
}

export const CardImage = ({ src, alt, width, height, fill, title, button, onClick }) => {
    const handleClick = useCallback(() => {
        if (typeof onClick === "function") {
            onClick();
        }
    });
    return (
        <div className="flex flex-col relative w-full" style={{ height: (height ? height + "px" : "200px") }}>
            {title && <div className='absolute w-fit z-10 p-2 font-semibold text-white bg-drop-shadow-4 m-2 rounded-lg'>
                {title}
            </div>}

            {button && <div className='absolute right-0 z-10 rounded-full p-1 m-2 bg-drop-shadow-4 hover:bg-drop-shadow-6 cursor-pointer drop-shadow w-7 h-7 text-white' onClick={handleClick}>
                <FontAwesomeIcon icon={faEllipsisVertical} width="20" height="20" />
            </div>}

            <Image src={src || "./images/default/no-image.png"} alt={alt || "imagem"} width={width} height={height} fill={fill} />
        </div>
    );
}

const Card = ({ children, width, className }) => {
    return (
        <div className={cn(`flex flex-row flex-wrap bg-white border border-gray-200 rounded-lg shadow`, width || "w-full", className )}>
            {children}
        </div>
    );
}

export default Card;


