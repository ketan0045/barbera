
import styles from './Pagination.scss';
import cn from "classnames";
import Icon from '../../../assets/svg/repeat-icon.svg';


export default function Pagination(props) {
  const { pages =1, current = 1, wrapperClass, onClick } = props;

  const onPrev = () => onClick && onClick(current - 1);
  const onNext = () => onClick && onClick(current + 1);
  const onPrevDash = () => onClick && onClick(current - 2);
  const onNextDash = () => onClick && onClick(current + 2);
  const onFirst = () => onClick && onClick(1);
  const onLast = () => onClick && onClick(pages);

  return (
    <div className={cn(styles.pagination, wrapperClass)}>
        <div className="pagination-alignment">
      <div className="prev-button">
          {current !== 1 ? (
        <button onClick={onPrev} className={styles.prev}>
         <div>
            <img src={Icon} alt="Icon"/>
          </div>
           <span>Prev</span> 
        </button>
     
      ) : (
        <button onClick={onPrev} className={styles.prev1} disabled>
          <div>
            <img src={Icon} alt="Icon"/>
          </div>
         <span>Prev</span> 
        </button>
      )}
         </div>
  
                 <div className="number">
      {current !== 1 && <button  className="page-box " onClick={onFirst}>1</button>}
      {current > 3 && <button className="page-box " onClick={onPrevDash}>...</button>}
      {current - 1 > 1 && <button  className="page-box " onClick={onPrev}>{current - 1}</button>}
      <button  className="page-box  active-page" >{current}</button>
   
      {current + 1 < pages && <button className="page-box " onClick={onNext}>{current + 1}</button>}
      {current <= pages - 3 && <button  className="page-box "onClick={onNextDash}>...</button>}
      {pages === 0  ? null :current !== pages && <button className="page-box "  onClick={onLast}>{pages}</button>}
      </div>
      <div className="next-button roatate-arrow">
        {pages === 0 ?<button onClick={onNext} className={styles.next1}  disabled>
     <span>Next</span> 
        <div>
          <img src={Icon} alt="Icon"/>
          </div>
        </button>:
      current !== pages ? (
    
        <button onClick={onNext} className={styles.next} >
        <span>Next</span> 
        <div>
          <img src={Icon} alt="Icon"/>
          </div>
        </button>
      ) : (
        <button onClick={onNext} className={styles.next1}  disabled>
          <span>Next</span> 
          <div>
                <img src={Icon} alt="Icon"/>
        </div>
              </button>
      )}
     </div>
     </div>
    </div>
  );
}
