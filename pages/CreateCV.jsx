import React, { useState, useEffect } from "react";

const CreateCV = ({ onSubmit }) => {
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    surname: "",
    description: "",
  });

  const [education, setEducation] = useState([]);
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    year: "",
    manualDegree: "",
    manualInstitution: "",
  });

  const [workExperiences, setWorkExperiences] = useState([]);
  const [newWorkExperience, setNewWorkExperience] = useState({
    position: "",
    company: "",
    tasks: "",
  });

  const [institutions, setInstitutions] = useState([]);
  const [loadingInstitutions, setLoadingInstitutions] = useState(false);
  const [addingDegreeManually, setAddingDegreeManually] = useState(false);
  const [addingInstitutionManually, setAddingInstitutionManually] = useState(false);

  // Diplômes prédéfinis
  const diplomas = ["Baccalauréat", "Licence", "Master", "Doctorat", "Diplôme d'ingénieur"];

  // Liste dynamique des années (1924 à l'année actuelle)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1924 + 1 }, (_, i) => 1924 + i);

  // Récupérer les établissements via l'API
  useEffect(() => {
    const fetchInstitutions = async () => {
      setLoadingInstitutions(true);
      try {
        const response = await fetch(
          "https://data.enseignementsup-recherche.gouv.fr/api/records/1.0/search/?dataset=fr-esr-principaux-etablissements-enseignement-superieur&q=&rows=100"
        );
        const data = await response.json();
        const institutionList = data.records.map((record) => record.fields.uo_lib);
        setInstitutions(institutionList);
      } catch (error) {
        console.error("Erreur lors de la récupération des établissements :", error);
      } finally {
        setLoadingInstitutions(false);
      }
    };

    fetchInstitutions();
  }, []);

  // Gestion des champs d'informations personnelles
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  // Gestion des champs pédagogiques
  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setNewEducation({ ...newEducation, [name]: value });
  };

  // Ajouter une expérience pédagogique
  const addEducation = () => {
    const educationEntry = {
      degree: addingDegreeManually ? newEducation.manualDegree : newEducation.degree,
      institution: addingInstitutionManually
        ? newEducation.manualInstitution
        : newEducation.institution,
      year: newEducation.year,
    };

    if (!educationEntry.degree || !educationEntry.institution || !educationEntry.year) {
      alert("Veuillez remplir tous les champs pour ajouter une expérience pédagogique.");
      return;
    }

    setEducation([...education, educationEntry]);
    setNewEducation({
      degree: "",
      institution: "",
      year: "",
      manualDegree: "",
      manualInstitution: "",
    });
    setAddingDegreeManually(false);
    setAddingInstitutionManually(false);
  };

  // Ajouter une expérience professionnelle
  const addWorkExperience = () => {
    if (!newWorkExperience.position || !newWorkExperience.company || !newWorkExperience.tasks) {
      alert("Veuillez remplir tous les champs pour ajouter une expérience professionnelle.");
      return;
    }

    setWorkExperiences([...workExperiences, newWorkExperience]);
    setNewWorkExperience({ position: "", company: "", tasks: "" });
  };

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    const cv = { personalInfo, education, workExperiences };
    onSubmit && onSubmit(cv);
    alert("CV créé avec succès !");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Informations personnelles</h3>
      <label>Nom</label>
      <input
        type="text"
        name="name"
        value={personalInfo.name}
        onChange={handlePersonalChange}
        required
      />
      <label>Prénom</label>
      <input
        type="text"
        name="surname"
        value={personalInfo.surname}
        onChange={handlePersonalChange}
        required
      />
      <label>Description</label>
      <textarea
        name="description"
        value={personalInfo.description}
        onChange={handlePersonalChange}
        rows="3"
      ></textarea>

      <h3>Expériences pédagogiques</h3>
      {education.map((edu, index) => (
        <div key={index}>
          <p>
            <strong>Diplôme :</strong> {edu.degree} <br />
            <strong>Établissement :</strong> {edu.institution} <br />
            <strong>Année :</strong> {edu.year}
          </p>
        </div>
      ))}
      <label>Diplôme</label>
      {!addingDegreeManually ? (
        <select
          name="degree"
          value={newEducation.degree}
          onChange={(e) => {
            if (e.target.value === "addNew") {
              setAddingDegreeManually(true);
            } else {
              handleEducationChange(e);
            }
          }}
          required
        >
          <option value="">Choisissez un diplôme</option>
          {diplomas.map((diploma, index) => (
            <option key={index} value={diploma}>
              {diploma}
            </option>
          ))}
          <option value="addNew">+ Ajouter un diplôme manuellement</option>
        </select>
      ) : (
        <input
          type="text"
          name="manualDegree"
          value={newEducation.manualDegree}
          onChange={handleEducationChange}
          required
          placeholder="Nom du diplôme"
        />
      )}
      <label>Établissement</label>
      {!addingInstitutionManually ? (
        <select
          name="institution"
          value={newEducation.institution}
          onChange={(e) => {
            if (e.target.value === "addNew") {
              setAddingInstitutionManually(true);
            } else {
              handleEducationChange(e);
            }
          }}
          required
        >
          <option value="">Choisissez un établissement</option>
          {loadingInstitutions ? (
            <option disabled>Chargement...</option>
          ) : (
            institutions.map((institution, index) => (
              <option key={index} value={institution}>
                {institution}
              </option>
            ))
          )}
          <option value="addNew">+ Ajouter un établissement manuellement</option>
        </select>
      ) : (
        <input
          type="text"
          name="manualInstitution"
          value={newEducation.manualInstitution}
          onChange={handleEducationChange}
          required
          placeholder="Nom de l'établissement"
        />
      )}
      <label>Année</label>
      <select
        name="year"
        value={newEducation.year}
        onChange={handleEducationChange}
        required
      >
        <option value="">Choisissez une année</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <button type="button" onClick={addEducation}>
        Ajouter une expérience pédagogique
      </button>

      <h3>Expériences professionnelles</h3>
      {workExperiences.map((work, index) => (
        <div key={index}>
          <p>
            <strong>Poste :</strong> {work.position} <br />
            <strong>Entreprise :</strong> {work.company} <br />
            <strong>Missions :</strong> {work.tasks}
          </p>
        </div>
      ))}
      <label>Poste</label>
      <input
        type="text"
        name="position"
        value={newWorkExperience.position}
        onChange={(e) =>
          setNewWorkExperience({ ...newWorkExperience, position: e.target.value })
        }
        required
      />
      <label>Entreprise</label>
      <input
        type="text"
        name="company"
        value={newWorkExperience.company}
        onChange={(e) =>
          setNewWorkExperience({ ...newWorkExperience, company: e.target.value })
        }
        required
      />
      <label>Missions</label>
      <textarea
        name="tasks"
        value={newWorkExperience.tasks}
        onChange={(e) =>
          setNewWorkExperience({ ...newWorkExperience, tasks: e.target.value })
        }
        required
      />
      <button type="button" onClick={addWorkExperience}>
        Ajouter une expérience professionnelle
      </button>

      <button type="submit">Créer le CV</button>
    </form>
  );
};

export default CreateCV;
