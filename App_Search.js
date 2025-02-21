import './App.css';
import React, { useState } from "react"

const Dropdown = () => {
    const [selectedValue, setSelectedValue] = useState("");
    const [selectedQuarter, setSelectedQuarter] = useState("");
    const [selectedSubArea, setSelectedSubArea] = useState("");

    const handleChange = (event) => {
      setSelectedQuarter(event.target.value);
    }
    const handleChange2 = (event) => {
      setSelectedSubArea(event.target.value);
    }
    console.log("value >>", selectedQuarter);
    return (
      <div className="card">
        <h3>Select Quarter</h3>
        <select value={selectedQuarter}  
        onChange={handleChange} className='dropdown'>
            <option value="">--Quarter--</option>
            <option value="20252">Spring 2025</option>
            <option value="20251">Winter 2025</option>
            <option value="20243">Fall 2024</option>
            <option value="20242">Spring 2024</option>
            <option value="20241">Winter 2024</option>
        </select>

        <h3>Select Subject Area</h3>
        <select value={selectedSubArea}  
        onChange={handleChange2} className='dropdown'>
            <option value="">--Subject Area--</option>
            <option value="ANTH ">Anthropology - ANTH</option>
            <option value="ART  ">Art - ART</option>
            <option value="ARTHI">Art History - ARTHI</option>
            <option value="ARTST">Art Studio - ARTST</option>
            <option value="AS AM">Asian American Studies - AS AM</option>
            <option value="ASTRO">Astronomy - ASTRO</option>
            <option value="BIOE ">Biological Engineering - BIOE</option>
            <option value="BIOL ">Biology (Creative Studies) - BIOL</option>
            <option value="BL ST">Black Studies - BL ST</option>
            <option value="CH E ">Chemical Engineering - CH E</option>
            <option value="CHEM ">Chemistry and Biochemistry - CHEM</option>
            <option value="CH ST">Chicano Studies - CH ST</option>
            <option value="CHIN ">Chinese - CHIN</option>
            <option value="CLASS">Classics - CLASS</option>
            <option value="COMM ">Communication - COMM</option>
            <option value="C LIT">Comparative Literature - C LIT</option>
            <option value="CMPSC">Computer Science - CMPSC</option>
            <option value="CNCSP">Counseling, Clinical, School Psychology - CNCSP</option>
            <option value="DANCE">Dance - DANCE</option>
            <option value="DYNS ">Dynamical Neuroscience - DYNS</option>
            <option value="EARTH">Earth Science - EARTH</option>
            <option value="EACS ">East Asian Cultural Studies - EACS</option>
            <option value="EEMB ">Ecology, Evolution, and Marine Biology - EEMB</option>
            <option value="ECON ">Economics - ECON</option>
            <option value="ED   ">Education - ED</option>
            <option value="ECE  ">Electrical Computer Engineering - ECE</option>
            <option value="ENGR ">Engineering Science - ENGR</option>
            <option value="ENGL ">English - ENGL</option>
            <option value="EDS  ">Environmental Data Science - EDS</option>
            <option value="ESM  ">Environmental Science and Management - ESM</option>
            <option value="ENV S">Environmental Studies - ENV S</option>
            <option value="ESS  ">Exercise and Sport Studies - ESS</option>
            <option value="ES   ">Exercise Sport - ES</option>
            <option value="FEMST">Feminist Studies - FEMST</option>
            <option value="FAMST">Film and Media Studies - FAMST</option>
            <option value="FR   ">French - FR</option>
            <option value="GEN S">General Studies (Creative Studies) - GEN S</option>
            <option value="GEOG ">Geography - GEOG</option>
            <option value="GER  ">German - GER</option>
            <option value="GPS  ">Global Peace and Security - GPS</option>
            <option value="GLOBL">Global Studies - GLOBL</option>
            <option value="GRAD ">Graduate Division - GRAD</option>
            <option value="GREEK">Greek - GREEK</option>
            <option value="HEB  ">Hebrew - HEB</option>
            <option value="HIST ">History - HIST</option>
            <option value="IQB  ">Interdis. Program in Quantitative Biosci - IQB</option>
            <option value="INT  ">Interdisciplinary - INT</option>
            <option value="ITAL ">Italian - ITAL</option>
            <option value="JAPAN">Japanese - JAPAN</option>
            <option value="KOR  ">Korean - KOR</option>
            <option value="LATIN">Latin - LATIN</option>
            <option value="LAIS ">Latin American and Iberian Studies - LAIS</option>
            <option value="LING ">Linguistics - LING</option>
            <option value="LIT  ">Literature (Creative Studies) - LIT</option>
            <option value="MARSC">Marine Science - MARSC</option>
            <option value="MATRL">Materials - MATRL</option>
            <option value="MATH ">Mathematics - MATH</option>
            <option value="ME   ">Mechanical Engineering - ME</option>
            <option value="MAT  ">Media Arts and Technology - MAT</option>
            <option value="ME ST">Medieval Studies - ME ST </option>
            <option value="MES  ">Middle East Studies - MES</option>
            <option value="MS   ">Military Science - MS</option>
            <option value="MCDB ">Molecular, Cellular and Develop. Biology - MCDB</option>
            <option value="MUS  ">Music - MUS</option>
            <option value="MUS A">Music Performance Laboratories - MUS A</option>
            <option value="PHIL ">Philosophy - PHIL</option>
            <option value="PHYS ">Physics - PHYS</option>
            <option value="POL S">Political Science - POL S</option>
            <option value="PORT ">Portuguese - PORT</option>
            <option value="PSY  ">Psychology - PSY</option>
            <option value="RG ST">Religious Studies - RG ST</option>
            <option value="RENST">Renaissance Studies - RENST</option>
            <option value="RUSS ">Russian - RUSS</option>
            <option value="SLAV ">Slavic - SLAV</option>
            <option value="SOC  ">Sociology - SOC</option>
            <option value="SPAN ">Spanish - SPAN</option>
            <option value="SHS  ">Speech and Hearing Sciences - SHS</option>
            <option value="PSTAT ">Statistics and Applied Probability - PSTAT</option>
            <option value="TMP  ">Technology Management - TMP</option>
            <option value="THTR ">Theater - THTR</option>
            <option value="WRIT ">Writing - WRIT</option>
            <option value="W&L  ">Writing and Literature (Creative Studies) - W&L</option>
          </select>
          <button className="button" onClick={() => console.log(selectedQuarter, selectedSubArea)}>
            Search
          </button>
      </div>
    )
}

export default Dropdown;