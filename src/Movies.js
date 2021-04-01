import React, { useState, useRef, useEffect } from 'react';
import InputFieldSet from './InputFieldSet';
import MovieItem from './MovieItem';
import db from './firebase/db';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);

  const [fieldValues, setFieldValues] = useState({
    highestBidderName: '',
    highestBid: '',
    title: '',
  });

  const processMoviesSnapshot = (snapshot) => {
    const items = [];
    const categories = [];

    snapshot.docs.forEach((item) => {
      const docItem = item.data();
      docItem['docId'] = item.id;

      if (!categories.includes(docItem.category)) {
        categories.push(docItem.category);
      }

      items.push(docItem);
    });
    console.log(categories);
    setCategories(categories);
    setMovies(items);
  };

  useEffect(() => {
    const unsubscribe = db
      .collection('movies')
      .onSnapshot(processMoviesSnapshot);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="container">
      <div className="row">
        <h1>Filmkatalógus</h1>
        <div className="d-flex mt-3">
          {/* <InputFieldSet
        reference={references['highestBid']}
        name="highestBid"
        labelText="Tét"
        type="number"
        errors={errors}
        fieldValues={fieldValues}
        handleInputBlur={handleInputBlur}
        handleInputChange={handleInputChange}
        required={true}
        /> */}
          <select
            id="auctionSelector"
            className={'form-select'}
            value={fieldValues.category}
            // onChange={handleAuctionChange}
            // ref={references['category']}
          >
            <option value={''}>Válassz!</option>
            {categories.map((item) => (
              <option key={item.category} value={item.category}>
                {item.category}
              </option>
            ))}
          </select>
        </div>
        <div className="d-flex my-3">
          <div className="pl-3 custom-control custom-checkbox ">
            <input
              className="custom-control-input me-3"
              name="checkbox1"
              type="checkbox"
              //checked={fieldValues.checkbox1}
              id="invalidCheck"
              // ref={references['checkbox1']}
              // onChange={handleCheckboxChange}
              required
            />
            <label className="custom-control-label me-3" htmlFor="invalidCheck">
              18 éven felülieknek
            </label>
          </div>

          <div className="pl-3 custom-control custom-checkbox ">
            <input
              className="custom-control-input me-3"
              name="radioButtons"
              type="radio"
              //checked={fieldValues.checkbox1}
              id="hungarian"
              // ref={references['checkbox1']}
              // onChange={handleCheckboxChange}
              required
            />
            <label className="custom-control-label me-3" htmlFor="hungarian">
              Magyar szinkron
            </label>
          </div>
          <div className="pl-3 custom-control custom-checkbox ">
            <input
              className="custom-control-input me-3"
              name="radioButtons"
              type="radio"
              //checked={fieldValues.checkbox1}
              id="nonehungarian"
              // ref={references['checkbox1']}
              // onChange={handleCheckboxChange}
              required
            />
            <label className="custom-control-label" htmlFor="nonehungarian">
              Összes film, bármilyen szinkronnal
            </label>
          </div>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Film címe</th>
              <th>Kategória</th>
              <th>Korhatár</th>
              <th>Oscar-díjak száma</th>
              <th>Magyar szinkron</th>
              <th>Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((item) => (
              <tr key={item.docId}>
                <MovieItem
                  title={item.title}
                  category={item.category}
                  age={item.age}
                  oscars={item.oscars}
                  hungarian={item.hungarian}
                />
                <td>
                  <button className="btn btn-primary me-3">Módosítás</button>
                  <button className="btn btn-danger">Törlés</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
