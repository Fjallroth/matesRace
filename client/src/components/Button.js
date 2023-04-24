import PropTypes from 'prop-types'

const Button = ({color, text, onClick}) => {
    

  return (<button onClick={onClick}  
  className={color}>
    {text}
    </button>
  )
}

Button.defaultProps = {
}

Button.propTypes ={
    text: PropTypes.string,
    color: PropTypes.string
}

export default Button
