import { useState } from "react";
import { Collapse } from "react-bootstrap";
const ShowDescription = ({
   text = '',
   classes = ''
}) => {
   const [view, setView] = useState(false);
   return (
      <span className={`${classes} description text-wrap`} >
         <span>{text.slice(0, 70)}</span>
         {(text.length > 70) &&
            <>
               {!view && <span>...</span>}
               <Collapse in={view} dimension="width" id="txt"><span>{text.slice(70, 300)}</span></Collapse>
               <button className='sort text-primary text-nowrap border-0 linkText Bg-fff' aria-controls="txt"
                  aria-expanded={view} onClick={(e) => { e.preventDefault(); setView(!view) }}> View {view ? 'less' : 'more'}</button>
            </>
         }
      </span>
   )
}
export default ShowDescription;