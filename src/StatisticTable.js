import React, { useState, useEffect } from 'react';

export default function StatisticTable(props) {
  const { movies, categories } = props;

  const [numberOfCategory, setNumberOfCategory] = useState({});
  const [percentOfCategory, setPercentOfCategory] = useState({});

  useEffect(() => {
    filterCategory();
  }, []);

  async function filterCategory() {
    let numbers = {};

    movies.forEach((movie) =>
      movie.category in numbers
        ? (numbers[movie.category] = numbers[movie.category] + 1)
        : (numbers[movie.category] = 1)
    );

    setNumberOfCategory(numbers);

    percentCategory(numbers);
  }

  function percentCategory(numbers) {
    let amount = 0;

    for (const key in numbers) {
      amount = amount + numbers[key];
    }

    let percents = {};

    for (const key in numbers) {
      percents[key] = Math.round((numbers[key] * 100) / amount);
    }

    setPercentOfCategory(percents);
  }

  return (
    <>
      <h2>Általános statisztika</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Film darabszám</th>
            <th>Korhatáros filmek száma</th>
            <th>Legtöbb Oscar-díjat kapott film</th>
            <th>Magyar szinkronos filmek aránya</th>
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
            {Object.entries(numberOfCategory).map((item) => {
              let categoryTitle = item[0];
              let title =
                categoryTitle.charAt(0).toUpperCase() + categoryTitle.slice(1);

              return <th key={item[0]}>{title}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.entries(numberOfCategory).map((item) => {
              let categoryNumber = item[1];

              return <td key={item[0] + item[1]}>{categoryNumber}</td>;
            })}
          </tr>
          <tr>
            {Object.entries(percentOfCategory).map((item, index) => {
              let categoryPercent = item[1];

              return <td key={item[1] + index}>{categoryPercent + ' %'}</td>;
            })}
          </tr>
        </tbody>
      </table>
    </>
  );
}
