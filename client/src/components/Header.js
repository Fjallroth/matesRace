import PropTypes from 'prop-types'
import { FaBabyCarriage } from 'react-icons/fa'
import Button from './Button'
//header should have the app title and a button link to the persons profile/settings
const Header = ({title, profileLink, onAdd, showAdd, buttonTitle}) => {
  return (
    <header className='header'>
      <h1 >{title}</h1>
      <Button color={showAdd ?'red' : 'green'} text={<a href={profileLink}>{buttonTitle}</a>}
      onClick={onAdd} />
    </header>
  )
}
Header.propTypes = {
    title: PropTypes.string,

}
export default Header