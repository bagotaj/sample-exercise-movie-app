import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'bootstrap';

import MovieItem from './MovieItem';
import StatisticTable from './StatisticTable';
import DeleteModal from './DeleteModal';

import db from './firebase/db';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [movieToBeDeleted, setMovieToBeDeleted] = useState(null);

  const [fieldValues, setFieldValues] = useState({
    hungarian: 'nonehungarian',
  });

  const deleteModalRef = useRef();

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
    setMovies(items);
  };

  const processCategorySnapshot = (snapshot) => {
    const categories = [];

    snapshot.docs.forEach((item) => {
      const docItem = item.data();

      if (!categories.includes(docItem.category)) {
        categories.push(docItem.category);
      }
    });
    setCategories(categories);
  };

  useEffect(() => {
    db.collection('movies').onSnapshot(processMoviesSnapshot);

    db.collection('movies').onSnapshot(processCategorySnapshot);
  }, []);

  function handleCategoryChange(e) {
    const value = e.target.value;
    const ref = db.collection('movies');
    if (value !== '') {
      ref.where('category', '==', value).get().then(processMoviesSnapshot);
    } else {
      ref.get().then(processMoviesSnapshot);
    }
  }

  function handleTitleSearchInputChange(e) {
    const value = e.target.value;

    db.collection('movies')
      .where('title', '>=', value)
      .where('title', '<=', value + '\uf8ff')
      .get()
      .then(processMoviesSnapshot);
  }

  function handleAgeCheckboxChange(e) {
    const checked = e.target.checked;

    if (checked) {
      db.collection('movies')
        .where('age', '>=', 18)
        .get()
        .then(processMoviesSnapshot);
    } else {
      db.collection('movies').get().then(processMoviesSnapshot);
    }
  }

  function handleDubbedRadioChange(e) {
    const value = e.target.value;
    setFieldValues({ ...fieldValues, hungarian: value });

    if (value === 'hungarian') {
      db.collection('movies')
        .where('hungarian', '==', true)
        .get()
        .then(processMoviesSnapshot);
    } else {
      db.collection('movies').get().then(processMoviesSnapshot);
    }
  }

  function handleDeleteConfirm() {
    db.collection('movies').doc(movieToBeDeleted).delete();

    const myModal = new Modal(deleteModalRef.current);
    myModal.show();
    myModal.hide();
  }

  function handleDeleteOnClick(e) {
    let toBeDeleted = e.target.dataset.id;

    setMovieToBeDeleted(toBeDeleted);
  }

  return (
    <div className="container">
      <div className="row">
        <h1 className="mt-3">Filmkatal??gus</h1>
        <div className="row">
          <label htmlFor="titleSearch" className="form-label m-2">
            Filmc??m keres??s
          </label>
          <div className="col-6">
            <input
              type="text"
              className="form-control"
              id="titleSearch"
              name="titleSearch"
              onChange={handleTitleSearchInputChange}
            />
          </div>
          <div className="col-6 ">
            <select
              id="auctionSelector"
              className={'form-select'}
              value={fieldValues.category}
              onChange={handleCategoryChange}
            >
              <option value={''}>V??lassz!</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="d-flex my-3">
          <div className="pl-3 custom-control custom-checkbox ">
            <input
              className="custom-control-input me-3"
              name="checkbox1"
              type="checkbox"
              id="invalidCheck"
              onChange={handleAgeCheckboxChange}
            />
            <label className="custom-control-label me-3" htmlFor="invalidCheck">
              18 ??ven fel??lieknek
            </label>
          </div>

          <div className="pl-3 custom-control custom-checkbox ">
            <input
              className="custom-control-input me-3"
              name="radioButtons"
              type="radio"
              id="hungarian"
              onChange={handleDubbedRadioChange}
              checked={fieldValues.hungarian === 'hungarian'}
              value="hungarian"
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
              id="nonehungarian"
              onChange={handleDubbedRadioChange}
              checked={fieldValues.hungarian === 'nonehungarian'}
              value="nonehungarian"
            />
            <label className="custom-control-label" htmlFor="nonehungarian">
              ??sszes film, b??rmilyen szinkronnal
            </label>
          </div>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Film c??me</th>
              <th>Kateg??ria</th>
              <th>Korhat??r</th>
              <th>Oscar-d??jak sz??ma</th>
              <th>Magyar szinkron</th>
              <th>M??veletek</th>
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
                  <Link to={`/movie/edit/${item.docId}`}>
                    <button className="btn btn-primary me-3">M??dos??t??s</button>
                  </Link>
                  <button
                    className="btn btn-danger"
                    data-id={item.docId}
                    data-bs-target="#myModal"
                    data-bs-toggle="modal"
                    onClick={handleDeleteOnClick}
                  >
                    T??rl??s
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to="/movie/new">
          <button className="btn btn-primary mb-5">??j film regisztr??ci??</button>
        </Link>
        <StatisticTable movies={movies} />
        <DeleteModal
          handleDeleteConfirm={handleDeleteConfirm}
          deleteModalRef={deleteModalRef}
        />
      </div>
    </div>
  );
}
