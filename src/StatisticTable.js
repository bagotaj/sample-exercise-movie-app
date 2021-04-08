import React, { useState } from 'react';

export default function StatisticTable(props) {
  const { movies, categories } = props;

  const [numberOfCategory, setNumberOfCategory] = useState(filterCategory());

  function filterCategory() {
    let numbers = { vígjáték: 0 };

    movies.forEach(
      (movie) => console.log(movie.category)
      //   movie.category === numbers[movie.category]
      //     ? {
      //         ...numbers,
      //         [movie.category]: numbers[movie.category] + 1,
      //       }
      //     : {
      //         ...numbers,
      //         [movie.category]: 1,
      //       }
    );

    return numbers;
  }

  return (
    <>
      <h2>Statisztika</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Film darabszám</th>
            <th>Korhatáros filmek száma</th>
            <th>Összes Oscar-díjak száma</th>
            <th>Magyar szinkronos filmek száma</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <h2>Kategória szerinti statisztika</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            {Object.entries(filterCategory()).map((item) => {
              let categoryTitle = item[0];

              return <th>{categoryTitle}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.entries(filterCategory()).map((item) => {
              let categoryNumber = item[1];

              return <th>{categoryNumber}</th>;
            })}
          </tr>
        </tbody>
      </table>
    </>
  );
}
