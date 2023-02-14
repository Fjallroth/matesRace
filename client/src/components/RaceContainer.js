import PropTypes from 'prop-types'
import Button from './Button'

const RaceContainer = ({buttonColor, title, planRace, buttonTitle}) => {
  return (
    <div className='header'>
    <h1>{title}</h1>
      <Button color={buttonColor} text={<a href={planRace}>{buttonTitle}</a>}
      />
    </div>
  )
}

export default RaceContainer