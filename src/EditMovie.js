import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import InputFieldSet from './InputFieldSet';
import db from './firebase/db';

export default function EditMovie() {
  const { id } = useParams();

  const [fieldValues, setFieldValues] = useState({
    title: '',
    category: '',
    oscars: '',
    hungarian: false,
    age: '',
  });

  const [formWasValidated, setFormWasValidated] = useState(false);

  const [formAlertText, setFormAlertText] = useState('');
  const [formAlertType, setFormAlertType] = useState('');

  const references = {
    title: useRef(),
    category: useRef(),
    oscars: useRef(),
  };

  const [errors, setErrors] = useState({
    title: '',
    category: '',
    oscars: '',
  });

  const validators = {
    title: {
      required: isNotEmpty,
    },
    category: {
      required: isNotEmpty,
    },
    oscars: {
      required: isNotEmpty,
      oscars: moreThanNull,
    },
  };

  function isNotEmpty(value) {
    return value !== '';
  }

  function moreThanNull(value) {
    if (!isNaN(value)) {
      if (value >= 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  const errorTypes = {
    required: 'Hiányzó érték.',
    oscars: 'Nem hiszem el, hogy minusz darab Oscart kapott! :-D',
  };

  function isFormValid() {
    let isFormValid = true;
    for (const fieldName of Object.keys(fieldValues)) {
      const isFieldValid = validateField(fieldName);
      if (!isFieldValid) {
        isFormValid = false;
      }
    }
    return isFormValid;
  }

  function validateField(fieldName) {
    const value = fieldValues[fieldName];
    let isValid = true;
    setErrors((previousErrors) => ({
      ...previousErrors,
      [fieldName]: '',
    }));
    //references[fieldName].current.setCustomValidity('');

    if (validators[fieldName] !== undefined) {
      for (const [validationType, validatorFn] of Object.entries(
        validators[fieldName]
      )) {
        if (isValid) {
          isValid = validatorFn(value);
          if (!isValid) {
            const errorText = errorTypes[validationType];
            setErrors((previousErrors) => {
              return {
                ...previousErrors,
                [fieldName]: errorText,
              };
            });
            references[fieldName].current.setCustomValidity(errorText);
          }
        }
      }
    }
    return isValid;
  }

  function handleInputChange(e) {
    const fieldName = e.target.name;
    let value;

    if (fieldName === 'hungarian') {
      value = e.target.checked;
    } else {
      value = e.target.value;
    }

    setFieldValues({
      ...fieldValues,
      [fieldName]: value,
    });
    setErrors((previousErrors) => ({
      ...previousErrors,
      [fieldName]: '',
    }));
  }

  function handleInputBlur(e) {
    const name = e.target.name;
    validateField(name);
  }

  async function movieTitleChecker(movieTitle) {
    const snapshot = await db
      .collection('movies')
      .where('title', '==', movieTitle)
      .get();

    return snapshot.docs.length !== 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const isValid = isFormValid();

    if (isValid) {
      db.collection('movies')
        .doc(id)
        .update({
          title: fieldValues.title,
          category: fieldValues.category,
          oscars: parseInt(fieldValues.oscars),
          hungarian: fieldValues.hungarian,
          age: parseInt(fieldValues.age),
        })
        .then((docRef) => {
          setFieldValues({
            title: '',
            category: '',
            oscars: '',
            hungarian: false,
            age: '',
          });
          setFormAlertText('Sikeres módosítás.');
          setFormAlertType('success');
        });
    } else {
      setFormAlertText('Sikertelen módosítás.');
      setFormAlertType('danger');
    }
  }

  useEffect(() => {
    db.collection('movies')
      .doc(id)
      .get()
      .then((docRef) => {
        let data = docRef.data();

        setFieldValues(data);
      });
  }, []);

  return (
    <div className="container">
      <div className="row">
        <h1 className="mt-3">Új film regisztráció</h1>
        <form
          onSubmit={handleSubmit}
          noValidate={true}
          className={`needs-validation ${
            formWasValidated ? 'was-validated' : ''
          }`}
        >
          <InputFieldSet
            reference={references.title}
            name="title"
            labelText="Film címe"
            type="text"
            errors={errors}
            fieldValues={fieldValues}
            handleInputBlur={handleInputBlur}
            handleInputChange={handleInputChange}
            required={true}
          />

          <div
            className={`mb-3 ${errors.category !== '' ? 'was-validated' : ''}`}
          >
            <label htmlFor="category" className="form-label m-2">
              Kategória
            </label>
            <select
              name="category"
              id="category"
              className="form-select m-2"
              value={fieldValues.category}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              ref={references.category}
              required={true}
            >
              <option value={''}>Válassz!</option>
              <option value="dráma">Dráma</option>
              <option value="horror">Horror</option>
              <option value="vígjáték">Vígjáték</option>
              <option value="thriller">Thriller</option>
              <option value="sci-fi">Sci-fi</option>
              <option value="animáció">Animáció</option>
            </select>
            <div className="invalid-feedback">{errors.category}</div>
          </div>

          <InputFieldSet
            reference={references.oscars}
            name="oscars"
            labelText="Oscar-díjak száma"
            type="text"
            errors={errors}
            fieldValues={fieldValues}
            handleInputBlur={handleInputBlur}
            handleInputChange={handleInputChange}
            required={true}
          />

          <div className="m-2">
            <input
              className="custom-control-input me-3"
              name="hungarian"
              type="checkbox"
              id="invalidCheck"
              checked={fieldValues.hungarian}
              onChange={handleInputChange}
            />
            <label className="custom-control-label me-3" htmlFor="invalidCheck">
              Magyar szinkron
            </label>
          </div>

          <div className={`row ${errors.age !== '' ? 'was-validated' : ''}`}>
            <h3>Korhatár</h3>
            <div className="col-2">
              <input
                className="custom-control-input me-3"
                name="age"
                type="radio"
                id="age12"
                value="12"
                checked={parseInt(fieldValues.age) === 12}
                onChange={handleInputChange}
              />
              <label className="custom-control-label me-3" htmlFor="age12">
                +12
              </label>
            </div>

            <div className="col-2">
              <input
                className="custom-control-input me-3"
                name="age"
                type="radio"
                id="age16"
                value="16"
                checked={parseInt(fieldValues.age) === 16}
                onChange={handleInputChange}
              />
              <label className="custom-control-label me-3" htmlFor="age16">
                +16
              </label>
            </div>

            <div className="col-2">
              <input
                className="custom-control-input me-3"
                name="age"
                type="radio"
                id="age18"
                value="18"
                checked={parseInt(fieldValues.age) === 18}
                onChange={handleInputChange}
              />
              <label className="custom-control-label me-3" htmlFor="age18">
                +18
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-3">
            Mentés
          </button>
        </form>
        {formAlertText && (
          <div className={`alert mt-3 alert-${formAlertType}`} role="alert">
            {formAlertText}
          </div>
        )}
      </div>
    </div>
  );
}
