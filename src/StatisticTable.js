import React, { useState, useEffect } from 'react';

export default function StatisticTable(props) {
  const { movies } = props;

  const [numberOfCategory, setNumberOfCategory] = useState({});
  const [percentOfCategory, setPercentOfCategory] = useState({});
  const [generalStatistics, setGeneralStatistics] = useState({
    numberOfMovies: 0,
    adultMovies: 0,
    mostOscars: '',
    hungarianDubbedRatio: 0,
  });

  useEffect(() => {
    filterCategory();
    makeGeneralStatistics();
  }, [movies]);

  async function filterCategory() {
    let numbers = {};

    movies.forEach((movie) =>
      numbers[movie.category]
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

  function makeGeneralStatistics() {
    let numberOfMovies = movies.length;
    let adultMovies = 0;
    let mostOscarMovie = movies[0];
    let hungarianDubbeds = 0;

    movies.forEach((movie) => {
      if (movie.age === 18) {
        adultMovies++;
      }

      if (mostOscarMovie.oscars < movie.oscars) {
        mostOscarMovie = movie;
      }

      if (movie.hungarian) {
        hungarianDubbeds++;
      }
    });

    setGeneralStatistics({
      numberOfMovies: numberOfMovies,
      adultMovies: adultMovies,
      mostOscars: mostOscarMovie?.title,
      hungarianDubbedRatio: Math.round(
        (hungarianDubbeds * 100) / numberOfMovies
      ),
    });
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
            <td>{generalStatistics.numberOfMovies}</td>
            <td>{generalStatistics.adultMovies}</td>
            <td>{generalStatistics.mostOscars}</td>
            <td>{generalStatistics.hungarianDubbedRatio + ' %'}</td>
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
