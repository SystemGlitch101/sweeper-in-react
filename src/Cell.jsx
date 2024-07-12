import './Cell.css'
import cell0 from './assets/cell0.svg'
import cell1 from './assets/cell1.svg'
import cell2 from './assets/cell2.svg'
import cell3 from './assets/cell3.svg'
import cell4 from './assets/cell4.svg'
import cell5 from './assets/cell5.svg'
import cell6 from './assets/cell6.svg'
import cell7 from './assets/cell7.svg'
import cell8 from './assets/cell8.svg'
import cellhidden from './assets/cellhidden.svg'
import cellflagged from './assets/cellflagged.svg'
import minered from './assets/minered.svg'
import mine from './assets/mine.svg'

function Cell({ boardIdx, cellIdx, x, y, handleClick, handleRightClick}) {
  const cellMap = [cell0, cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cellhidden, cellflagged, mine, minered]

  return (
    <>
      <img 
        // TODO: state machine for input system 
        onClick={() => handleClick(boardIdx)}
        onContextMenu={ (e) => { e.preventDefault(); handleRightClick(boardIdx); }}
        draggable="false"
        className="element size26 cell selector"
        style={{ '--x': x, '--y': y }}
        src={cellMap[cellIdx]} />
    </>
  );
}

export default Cell;