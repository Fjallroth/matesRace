import PropTypes from 'prop-types'
import Button from './Button'

const RaceContainer = ({ title, planRace, buttonTitle, onAdd, showAdd}) => {
  return (
    <div className='header'>
    <h1>{title}</h1>
    
      <Button color={showAdd ?'red' : 'green'} text={<a href={planRace}>{buttonTitle}</a>}
      onClick={onAdd}/>
    </div>
  )
}

export default RaceContainer