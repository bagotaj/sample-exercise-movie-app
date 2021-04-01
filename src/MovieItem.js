const MovieItem = ({ title, category, age, oscars, hungarian }) => {
  return (
    <>
      <td>{title}</td>
      <td>{category}</td>
      <td>{age}</td>
      <td>{oscars}</td>
      <td>{hungarian ? '✔️' : '❌'}</td>
    </>
  );
};

export default MovieItem;
