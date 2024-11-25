import React, { useState, useEffect } from "react";

const CVForm = ({ onSubmit, initialData = {}, token }) => {
  const [personalInfo, setPersonalInfo] = useState({
    name: initialData?.informationsPersonnelles?.nom || "",
    surname: initialData?.informationsPersonnelles?.prenom || "",
    description: initialData?.informationsPersonnelles?.description || "",
  });

  const [education, setEducation] = useState(initialData?.education || []);
  const [newEducation, setNewEducation] = useState({
    diplome: "",
    institution: "",
    annee: "",
    manualInstitution: "",
    manualDegree: "",
  });

  const [workExperiences, setWorkExperiences] = useState(initialData?.experience || []);
  const [newWorkExperience, setNewWorkExperience] = useState({
    poste: "",
    entreprise: "",
    taches: "",
    duree: "",
    visibility: initialData?.visibilite || true,
  });

  const [institutions, setInstitutions] = useState([]);
  const [loadingInstitutions, setLoadingInstitutions] = useState(false);
  const [addingInstitutionManually, setAddingInstitutionManually] = useState(false);
  const [addingDegreeManually, setAddingDegreeManually] = useState(false);

  const diplomas = ["Baccalauréat", "Licence", "Master", "Doctorat", "Diplôme d'ingénieur"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1924 + 1 }, (_, i) => 1924 + i);

  // Fetch institutions (API pour les établissements en France)
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

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setNewEducation((prev) => ({ ...prev, [name]: value }));
  };

  const handleWorkExperienceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewWorkExperience((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addEducation = () => {
    const educationEntry = {
      diplome: addingDegreeManually ? newEducation.manualDegree : newEducation.diplome,
      institution: addingInstitutionManually
        ? newEducation.manualInstitution
        : newEducation.institution,
      annee: newEducation.annee,
    };

    if (!educationEntry.diplome || !educationEntry.institution || !educationEntry.annee) {
      alert("Veuillez remplir tous les champs pour ajouter une expérience pédagogique.");
      return;
    }

    setEducation((prev) => [...prev, educationEntry]);
    setNewEducation({
      diplome: "",
      institution: "",
      annee: "",
      manualInstitution: "",
      manualDegree: "",
    });
    setAddingInstitutionManually(false);
    setAddingDegreeManually(false);
  };

  const addWorkExperience = () => {
    const workEntry = {
      poste: newWorkExperience.poste,
      entreprise: newWorkExperience.entreprise,
      taches: newWorkExperience.taches,
      duree: newWorkExperience.duree,
      visibility: newWorkExperience.visibility,
    };

    if (!workEntry.poste || !workEntry.entreprise || !workEntry.taches) {
      alert("Veuillez remplir tous les champs pour ajouter une expérience professionnelle.");
      return;
    }

    setWorkExperiences((prev) => [...prev, workEntry]);
    setNewWorkExperience({
      poste: "",
      entreprise: "",
      taches: "",
      duree: "",
      visibility: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      informationsPersonnelles: {
        prenom: personalInfo.surname,
        nom: personalInfo.name,
        description: personalInfo.description,
      },
      education: education.map((edu) => ({
        diplome: edu.diplome,
        institution: edu.institution,
        annee: parseInt(edu.annee, 10),
      })),
      experience: workExperiences.map((work) => ({
        poste: work.poste,
        entreprise: work.entreprise,
        duree: `${work.duree} mois`,
        taches: work.taches,
        visibility: work.visibility,
      })),
      visibilite: newWorkExperience.visibility, // Récupérer visibilité
    };

    console.log("Payload envoyé :", payload); // Vérifiez si les données sont correctes
    onSubmit(payload); // Envoyer au parent
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Informations personnelles</h3>
      <label>Nom</label>
      <input type="text" name="name" value={personalInfo.name} onChange={handlePersonalChange} />
      <label>Prénom</label>
      <input
        type="text"
        name="surname"
        value={personalInfo.surname}
        onChange={handlePersonalChange}
      />
      <label>Description</label>
      <textarea
        name="description"
        value={personalInfo.description}
        onChange={handlePersonalChange}
      />

      <h3>Éducation</h3>
      {education.map((edu, index) => (
        <div key={index}>
          {`${edu.diplome}, ${edu.institution}, ${edu.annee}`}
          <button
            type="button"
            onClick={() => setEducation((prev) => prev.filter((_, i) => i !== index))}
          >
            Supprimer
          </button>
        </div>
      ))}
      <label>Diplôme</label>
      {addingDegreeManually ? (
        <input
          type="text"
          name="manualDegree"
          value={newEducation.manualDegree}
          onChange={handleEducationChange}
        />
      ) : (
        <select
          name="diplome"
          value={newEducation.diplome}
          onChange={(e) => {
            if (e.target.value === "addNew") setAddingDegreeManually(true);
            else handleEducationChange(e);
          }}
        >
          <option value="">Choisissez un diplôme</option>
          {diplomas.map((diploma) => (
            <option key={diploma} value={diploma}>
              {diploma}
            </option>
          ))}
          <option value="addNew">Ajouter manuellement</option>
        </select>
      )}
      <label>Établissement</label>
      {addingInstitutionManually ? (
        <input
          type="text"
          name="manualInstitution"
          value={newEducation.manualInstitution}
          onChange={handleEducationChange}
        />
      ) : (
        <select
          name="institution"
          value={newEducation.institution}
          onChange={(e) => {
            if (e.target.value === "addNew") setAddingInstitutionManually(true);
            else handleEducationChange(e);
          }}
        >
          <option value="">Choisissez un établissement</option>
          {loadingInstitutions ? (
            <option disabled>Chargement...</option>
          ) : (
            institutions.map((institution) => (
              <option key={institution} value={institution}>
                {institution}
              </option>
            ))
          )}
          <option value="addNew">Ajouter manuellement</option>
        </select>
      )}
      <label>Année</label>
      <select name="annee" value={newEducation.annee} onChange={handleEducationChange}>
        <option value="">Choisissez une année</option>
        {years.map((annee) => (
          <option key={annee} value={annee}>
            {annee}
          </option>
        ))}
      </select>
      <button type="button" onClick={addEducation}>
        Ajouter une éducation
      </button>

      <h3>Expériences professionnelles</h3>
      {workExperiences.map((work, index) => (
        <div key={index}>
          <p>
            <strong>Poste :</strong> {work.poste} <br />
            <strong>Entreprise :</strong> {work.entreprise} <br />
            <strong>Missions :</strong> {work.taches} <br />
            <strong>Durée :</strong> {work.duree} mois <br />
            <strong>Visible :</strong> {work.visibility ? "Oui" : "Non"}
          </p>
          <button
            type="button"
            onClick={() =>
              setWorkExperiences((prev) => prev.filter((_, i) => i !== index))
            }
          >
            Supprimer
          </button>
        </div>
      ))}
      <label>Poste</label>
      <input
        type="text"
        name="poste"
        value={newWorkExperience.poste}
        onChange={handleWorkExperienceChange}
        required
      />
      <label>Entreprise</label>
      <input
        type="text"
        name="entreprise"
        value={newWorkExperience.entreprise}
        onChange={handleWorkExperienceChange}
        required
      />
      <label>Missions</label>
      <textarea
        name="taches"
        value={newWorkExperience.taches}
        onChange={handleWorkExperienceChange}
        required
      ></textarea>
      <label>Durée (en mois)</label>
      <input
        type="number"
        name="duree"
        value={newWorkExperience.duree}
        onChange={handleWorkExperienceChange}
        required
        min="1"
      />
      <label>Visibilité</label>
      <input
        type="checkbox"
        name="visibility"
        checked={newWorkExperience.visibility}
        onChange={handleWorkExperienceChange}
      />
      <button type="button" onClick={addWorkExperience}>
        Ajouter une expérience professionnelle
      </button>

      <button type="submit">Soumettre</button>
    </form>
  );
};

export default CVForm;
