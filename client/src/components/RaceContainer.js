import PropTypes from 'prop-types';
import Button from './Button';

const RaceContainer = ({ title, planRace, buttonTitle, onAdd, showAdd }) => {
  return (
    <div className="header flex justify-between items-center w-full">
      <h1>{title}</h1>

      <Button
        color={showAdd ? "bg-gray-300 text-purple-700 rounded-md p-1" : "bg-purple-300 text-gray-700 rounded-md p-1"}
        text={<a href={planRace}>{buttonTitle}</a>}
        onClick={onAdd}
      />
    </div>
  );
};

export default RaceContainer;