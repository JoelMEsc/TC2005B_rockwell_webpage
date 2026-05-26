import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiBase = import.meta.env.VITE_API_URL;

function SignUp() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('USA');
  const [nickname, setNickname] = useState('');
  const [role, setRole] = useState('estudiante');
  const [error, setError] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Valida formato básico de correo: algo@algo.algo
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // El dominio debe contener "rockwell" para poder elegir ese rol
  const isRockwellEmail = (value) => {
    const domain = value.split('@')[1] ?? '';
    return domain.toLowerCase().includes('rockwell');
  };

  // Revalida el email cada vez que cambia el email o el rol
  const validateEmail = (value, currentRole) => {
    if (!value) { setEmailError(''); return; }
    if (!isValidEmail(value)) {
      setEmailError('Invalid email address.');
      return;
    }
    if (currentRole === 'trabajador_rockwell' && !isRockwellEmail(value)) {
      setEmailError('Email doesn\'t belong to Rockwell Automation.');
      return;
    }
    setEmailError('');
  };

  const handleRegister = async () => {
    // Bloquear envío si el email no es válido
    if (!isValidEmail(email)) {
      setEmailError('Invalid email address.');
      return;
    }
    if (role === 'trabajador_rockwell' && !isRockwellEmail(email)) {
      setEmailError('Email doesn\'t belong to Rockwell Automation.');
      return;
    }

    setError(false);
    setLoading(true);
    try {
      await axios.post(`${apiBase}/api/auth/registro`,
        { name, surname, email, password, country, nickname, role }
      );
      navigate('/login');
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (setter) => (e) => {
    setError(false);
    setter(e.target.value);
  };

  // Email y role tienen handlers propios para revalidar en tiempo real
  const handleEmailChange = (e) => {
    setError(false);
    setEmail(e.target.value);
    validateEmail(e.target.value, role);
  };

  const handleRoleChange = (e) => {
    setError(false);
    setRole(e.target.value);
    validateEmail(email, e.target.value);
  };

  const labelClass = "font-bold text-gray-800 text-sm sm:text-base";

  // Ahora acepta un flag para marcar el campo en rojo individualmente
  const inputClass = (hasFieldError = false) =>
    `rounded-lg px-4 py-2 text-black placeholder-gray-400 outline-none focus:ring-2 transition w-full ${
      hasFieldError
        ? 'bg-red-100 ring-2 ring-red-500'
        : 'bg-gray-100 focus:ring-orange-300'
    }`;

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-72px)]">

      {/* Banner */}
      <div
        className="w-full py-7 sm:py-8 flex items-center justify-center rounded-b-3xl shadow-md"
        style={{ background: 'linear-gradient(to right, #F58025, #CD163F)' }}
      >
        <h1 className="text-white font-bold text-3xl sm:text-4xl tracking-wide">Sign Up</h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 sm:px-6 overflow-y-auto py-6">
        <div className="w-full max-w-sm sm:max-w-2xl">

          {/* ── MÓVIL: columna simple ── */}
          <div className="flex flex-col gap-4 sm:hidden">
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Name</label>
              <input type="text" placeholder="John" className={inputClass()} value={name} onChange={handleChange(setName)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Surname</label>
              <input type="text" placeholder="Doe" className={inputClass()} value={surname} onChange={handleChange(setSurname)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Username</label>
              <input type="text" placeholder="JohnDoe123" className={inputClass()} value={nickname} onChange={handleChange(setNickname)} />
            </div>

            {/* Email con mensaje de error debajo */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Email</label>
              <input type="text" placeholder="user@email.com" className={inputClass(!!emailError)} value={email} onChange={handleEmailChange} />
              {emailError && <p className="text-red-500 text-xs font-semibold">{emailError}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className={labelClass}>Country</label>
              <select className={inputClass()} value={country} onChange={handleChange(setCountry)}>
                <option value="ABW">Aruba</option><option value="AFG">Afghanistan</option><option value="AGO">Angola</option><option value="AIA">Anguilla</option><option value="ALA">Åland Islands</option><option value="ALB">Albania</option><option value="AND">Andorra</option><option value="ARE">United Arab Emirates</option><option value="ARG">Argentina</option><option value="ARM">Armenia</option><option value="ASM">American Samoa</option><option value="ATA">Antarctica</option><option value="ATF">French Southern Territories</option><option value="ATG">Antigua and Barbuda</option><option value="AUS">Australia</option><option value="AUT">Austria</option><option value="AZE">Azerbaijan</option><option value="BDI">Burundi</option><option value="BEL">Belgium</option><option value="BEN">Benin</option><option value="BES">Bonaire, Sint Eustatius and Saba</option><option value="BFA">Burkina Faso</option><option value="BGD">Bangladesh</option><option value="BGR">Bulgaria</option><option value="BHR">Bahrain</option><option value="BHS">Bahamas</option><option value="BIH">Bosnia and Herzegovina</option><option value="BLM">Saint Barthélemy</option><option value="BLR">Belarus</option><option value="BLZ">Belize</option><option value="BMU">Bermuda</option><option value="BOL">Bolivia, Plurinational State of</option><option value="BRA">Brazil</option><option value="BRB">Barbados</option><option value="BRN">Brunei Darussalam</option><option value="BTN">Bhutan</option><option value="BVT">Bouvet Island</option><option value="BWA">Botswana</option><option value="CAF">Central African Republic</option><option value="CAN">Canada</option><option value="CCK">Cocos (Keeling) Islands</option><option value="CHE">Switzerland</option><option value="CHL">Chile</option><option value="CHN">China</option><option value="CIV">Côte d'Ivoire</option><option value="CMR">Cameroon</option><option value="COD">Congo, Democratic Republic of the</option><option value="COG">Congo</option><option value="COK">Cook Islands</option><option value="COL">Colombia</option><option value="COM">Comoros</option><option value="CPV">Cabo Verde</option><option value="CRI">Costa Rica</option><option value="CUB">Cuba</option><option value="CUW">Curaçao</option><option value="CXR">Christmas Island</option><option value="CYM">Cayman Islands</option><option value="CYP">Cyprus</option><option value="CZE">Czechia</option><option value="DEU">Germany</option><option value="DJI">Djibouti</option><option value="DMA">Dominica</option><option value="DNK">Denmark</option><option value="DOM">Dominican Republic</option><option value="DZA">Algeria</option><option value="ECU">Ecuador</option><option value="EGY">Egypt</option><option value="ERI">Eritrea</option><option value="ESH">Western Sahara</option><option value="ESP">Spain</option><option value="EST">Estonia</option><option value="ETH">Ethiopia</option><option value="FIN">Finland</option><option value="FJI">Fiji</option><option value="FLK">Falkland Islands (Malvinas)</option><option value="FRA">France</option><option value="FRO">Faroe Islands</option><option value="FSM">Micronesia, Federated States of</option><option value="GAB">Gabon</option><option value="GBR">United Kingdom of Great Britain and Northern Ireland</option><option value="GEO">Georgia</option><option value="GGY">Guernsey</option><option value="GHA">Ghana</option><option value="GIB">Gibraltar</option><option value="GIN">Guinea</option><option value="GLP">Guadeloupe</option><option value="GMB">Gambia</option><option value="GNB">Guinea-Bissau</option><option value="GNQ">Equatorial Guinea</option><option value="GRC">Greece</option><option value="GRD">Grenada</option><option value="GRL">Greenland</option><option value="GTM">Guatemala</option><option value="GUF">French Guiana</option><option value="GUM">Guam</option><option value="GUY">Guyana</option><option value="HKG">Hong Kong</option><option value="HMD">Heard Island and McDonald Islands</option><option value="HND">Honduras</option><option value="HRV">Croatia</option><option value="HTI">Haiti</option><option value="HUN">Hungary</option><option value="IDN">Indonesia</option><option value="IMN">Isle of Man</option><option value="IND">India</option><option value="IOT">British Indian Ocean Territory</option><option value="IRL">Ireland</option><option value="IRN">Iran, Islamic Republic of</option><option value="IRQ">Iraq</option><option value="ISL">Iceland</option><option value="ISR">Israel</option><option value="ITA">Italy</option><option value="JAM">Jamaica</option><option value="JEY">Jersey</option><option value="JOR">Jordan</option><option value="JPN">Japan</option><option value="KAZ">Kazakhstan</option><option value="KEN">Kenya</option><option value="KGZ">Kyrgyzstan</option><option value="KHM">Cambodia</option><option value="KIR">Kiribati</option><option value="KNA">Saint Kitts and Nevis</option><option value="KOR">Korea, Republic of</option><option value="KWT">Kuwait</option><option value="LAO">Lao People's Democratic Republic</option><option value="LBN">Lebanon</option><option value="LBR">Liberia</option><option value="LBY">Libya</option><option value="LCA">Saint Lucia</option><option value="LIE">Liechtenstein</option><option value="LKA">Sri Lanka</option><option value="LSO">Lesotho</option><option value="LTU">Lithuania</option><option value="LUX">Luxembourg</option><option value="LVA">Latvia</option><option value="MAC">Macao</option><option value="MAF">Saint Martin (French part)</option><option value="MAR">Morocco</option><option value="MCO">Monaco</option><option value="MDA">Moldova, Republic of</option><option value="MDG">Madagascar</option><option value="MDV">Maldives</option><option value="MEX">Mexico</option><option value="MHL">Marshall Islands</option><option value="MKD">North Macedonia</option><option value="MLI">Mali</option><option value="MLT">Malta</option><option value="MMR">Myanmar</option><option value="MNE">Montenegro</option><option value="MNG">Mongolia</option><option value="MNP">Northern Mariana Islands</option><option value="MOZ">Mozambique</option><option value="MRT">Mauritania</option><option value="MSR">Montserrat</option><option value="MTQ">Martinique</option><option value="MUS">Mauritius</option><option value="MWI">Malawi</option><option value="MYS">Malaysia</option><option value="MYT">Mayotte</option><option value="NAM">Namibia</option><option value="NCL">New Caledonia</option><option value="NER">Niger</option><option value="NFK">Norfolk Island</option><option value="NGA">Nigeria</option><option value="NIC">Nicaragua</option><option value="NIU">Niue</option><option value="NLD">Netherlands, Kingdom of the</option><option value="NOR">Norway</option><option value="NPL">Nepal</option><option value="NRU">Nauru</option><option value="NZL">New Zealand</option><option value="OMN">Oman</option><option value="PAK">Pakistan</option><option value="PAN">Panama</option><option value="PCN">Pitcairn</option><option value="PER">Peru</option><option value="PHL">Philippines</option><option value="PLW">Palau</option><option value="PNG">Papua New Guinea</option><option value="POL">Poland</option><option value="PRI">Puerto Rico</option><option value="PRK">Korea, Democratic People's Republic of</option><option value="PRT">Portugal</option><option value="PRY">Paraguay</option><option value="PSE">Palestine, State of</option><option value="PYF">French Polynesia</option><option value="QAT">Qatar</option><option value="REU">Réunion</option><option value="ROU">Romania</option><option value="RUS">Russian Federation</option><option value="RWA">Rwanda</option><option value="SAU">Saudi Arabia</option><option value="SDN">Sudan</option><option value="SEN">Senegal</option><option value="SGP">Singapore</option><option value="SGS">South Georgia and the South Sandwich Islands</option><option value="SHN">Saint Helena, Ascension and Tristan da Cunha</option><option value="SJM">Svalbard and Jan Mayen</option><option value="SLB">Solomon Islands</option><option value="SLE">Sierra Leone</option><option value="SLV">El Salvador</option><option value="SMR">San Marino</option><option value="SOM">Somalia</option><option value="SPM">Saint Pierre and Miquelon</option><option value="SRB">Serbia</option><option value="SSD">South Sudan</option><option value="STP">Sao Tome and Principe</option><option value="SUR">Suriname</option><option value="SVK">Slovakia</option><option value="SVN">Slovenia</option><option value="SWE">Sweden</option><option value="SWZ">Eswatini</option><option value="SXM">Sint Maarten (Dutch part)</option><option value="SYC">Seychelles</option><option value="SYR">Syrian Arab Republic</option><option value="TCA">Turks and Caicos Islands</option><option value="TCD">Chad</option><option value="TGO">Togo</option><option value="THA">Thailand</option><option value="TJK">Tajikistan</option><option value="TKL">Tokelau</option><option value="TKM">Turkmenistan</option><option value="TLS">Timor-Leste</option><option value="TON">Tonga</option><option value="TTO">Trinidad and Tobago</option><option value="TUN">Tunisia</option><option value="TUR">Türkiye</option><option value="TUV">Tuvalu</option><option value="TWN">Taiwan, Province of China</option><option value="TZA">Tanzania, United Republic of</option><option value="UGA">Uganda</option><option value="UKR">Ukraine</option><option value="UMI">United States Minor Outlying Islands</option><option value="URY">Uruguay</option><option value="USA">United States of America</option><option value="UZB">Uzbekistan</option><option value="VAT">Holy See</option><option value="VCT">Saint Vincent and the Grenadines</option><option value="VEN">Venezuela, Bolivarian Republic of</option><option value="VGB">Virgin Islands (British)</option><option value="VIR">Virgin Islands (U.S.)</option><option value="VNM">Viet Nam</option><option value="VUT">Vanuatu</option><option value="WLF">Wallis and Futuna</option><option value="WSM">Samoa</option><option value="YEM">Yemen</option><option value="ZAF">South Africa</option><option value="ZMB">Zambia</option><option value="ZWE">Zimbabwe</option>
              </select>
            </div>

            {/* Role con handler especial */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Role</label>
              <select className={inputClass()} value={role} onChange={handleRoleChange}>
                <option value="estudiante">Student</option>
                <option value="trabajador_rockwell">Rockwell Employee</option>
                <option value="otra_empresa">Other Company</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className={labelClass}>Password</label>
              <input type="password" placeholder="securePassword123" className={inputClass()} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center font-semibold">
                Error al registrarse. Intenta de nuevo.
              </p>
            )}
            <button type="button" onClick={handleRegister}
              className="bg-[#003e7e] text-white font-bold px-10 py-2 rounded-full active:scale-95 transition-transform duration-150 w-full">
              {loading ? 'Loading...' : 'Sign Up'}
            </button>
          </div>

          {/* ── DESKTOP: grid de 4 columnas ── */}
          <div className="hidden sm:grid gap-x-6 gap-y-5 items-start"
            style={{ gridTemplateColumns: 'auto 1fr auto 1fr' }}>

            <label className={`${labelClass} pt-2`}>Name</label>
            <input type="text" placeholder="John" className={inputClass()} value={name} onChange={handleChange(setName)} />
            <label className={`${labelClass} pt-2`}>Surname</label>
            <input type="text" placeholder="Doe" className={inputClass()} value={surname} onChange={handleChange(setSurname)} />

            <label className={`${labelClass} pt-2`}>Username</label>
            <input type="text" placeholder="JohnDoe123" className={inputClass()} value={nickname} onChange={handleChange(setNickname)} />

            {/* Email — ocupa 1 celda pero tiene mensaje de error debajo */}
            <label className={`${labelClass} pt-2`}>Email</label>
            <div className="flex flex-col gap-1">
              <input type="text" placeholder="user@email.com" className={inputClass(!!emailError)} value={email} onChange={handleEmailChange} />
              {emailError && <p className="text-red-500 text-xs font-semibold">{emailError}</p>}
            </div>

            <label className={`${labelClass} pt-2`}>Country</label>
            <select className={inputClass()} value={country} onChange={handleChange(setCountry)}>
              <option value="ABW">Aruba</option><option value="AFG">Afghanistan</option><option value="AGO">Angola</option><option value="AIA">Anguilla</option><option value="ALA">Åland Islands</option><option value="ALB">Albania</option><option value="AND">Andorra</option><option value="ARE">United Arab Emirates</option><option value="ARG">Argentina</option><option value="ARM">Armenia</option><option value="ASM">American Samoa</option><option value="ATA">Antarctica</option><option value="ATF">French Southern Territories</option><option value="ATG">Antigua and Barbuda</option><option value="AUS">Australia</option><option value="AUT">Austria</option><option value="AZE">Azerbaijan</option><option value="BDI">Burundi</option><option value="BEL">Belgium</option><option value="BEN">Benin</option><option value="BES">Bonaire, Sint Eustatius and Saba</option><option value="BFA">Burkina Faso</option><option value="BGD">Bangladesh</option><option value="BGR">Bulgaria</option><option value="BHR">Bahrain</option><option value="BHS">Bahamas</option><option value="BIH">Bosnia and Herzegovina</option><option value="BLM">Saint Barthélemy</option><option value="BLR">Belarus</option><option value="BLZ">Belize</option><option value="BMU">Bermuda</option><option value="BOL">Bolivia, Plurinational State of</option><option value="BRA">Brazil</option><option value="BRB">Barbados</option><option value="BRN">Brunei Darussalam</option><option value="BTN">Bhutan</option><option value="BVT">Bouvet Island</option><option value="BWA">Botswana</option><option value="CAF">Central African Republic</option><option value="CAN">Canada</option><option value="CCK">Cocos (Keeling) Islands</option><option value="CHE">Switzerland</option><option value="CHL">Chile</option><option value="CHN">China</option><option value="CIV">Côte d'Ivoire</option><option value="CMR">Cameroon</option><option value="COD">Congo, Democratic Republic of the</option><option value="COG">Congo</option><option value="COK">Cook Islands</option><option value="COL">Colombia</option><option value="COM">Comoros</option><option value="CPV">Cabo Verde</option><option value="CRI">Costa Rica</option><option value="CUB">Cuba</option><option value="CUW">Curaçao</option><option value="CXR">Christmas Island</option><option value="CYM">Cayman Islands</option><option value="CYP">Cyprus</option><option value="CZE">Czechia</option><option value="DEU">Germany</option><option value="DJI">Djibouti</option><option value="DMA">Dominica</option><option value="DNK">Denmark</option><option value="DOM">Dominican Republic</option><option value="DZA">Algeria</option><option value="ECU">Ecuador</option><option value="EGY">Egypt</option><option value="ERI">Eritrea</option><option value="ESH">Western Sahara</option><option value="ESP">Spain</option><option value="EST">Estonia</option><option value="ETH">Ethiopia</option><option value="FIN">Finland</option><option value="FJI">Fiji</option><option value="FLK">Falkland Islands (Malvinas)</option><option value="FRA">France</option><option value="FRO">Faroe Islands</option><option value="FSM">Micronesia, Federated States of</option><option value="GAB">Gabon</option><option value="GBR">United Kingdom of Great Britain and Northern Ireland</option><option value="GEO">Georgia</option><option value="GGY">Guernsey</option><option value="GHA">Ghana</option><option value="GIB">Gibraltar</option><option value="GIN">Guinea</option><option value="GLP">Guadeloupe</option><option value="GMB">Gambia</option><option value="GNB">Guinea-Bissau</option><option value="GNQ">Equatorial Guinea</option><option value="GRC">Greece</option><option value="GRD">Grenada</option><option value="GRL">Greenland</option><option value="GTM">Guatemala</option><option value="GUF">French Guiana</option><option value="GUM">Guam</option><option value="GUY">Guyana</option><option value="HKG">Hong Kong</option><option value="HMD">Heard Island and McDonald Islands</option><option value="HND">Honduras</option><option value="HRV">Croatia</option><option value="HTI">Haiti</option><option value="HUN">Hungary</option><option value="IDN">Indonesia</option><option value="IMN">Isle of Man</option><option value="IND">India</option><option value="IOT">British Indian Ocean Territory</option><option value="IRL">Ireland</option><option value="IRN">Iran, Islamic Republic of</option><option value="IRQ">Iraq</option><option value="ISL">Iceland</option><option value="ISR">Israel</option><option value="ITA">Italy</option><option value="JAM">Jamaica</option><option value="JEY">Jersey</option><option value="JOR">Jordan</option><option value="JPN">Japan</option><option value="KAZ">Kazakhstan</option><option value="KEN">Kenya</option><option value="KGZ">Kyrgyzstan</option><option value="KHM">Cambodia</option><option value="KIR">Kiribati</option><option value="KNA">Saint Kitts and Nevis</option><option value="KOR">Korea, Republic of</option><option value="KWT">Kuwait</option><option value="LAO">Lao People's Democratic Republic</option><option value="LBN">Lebanon</option><option value="LBR">Liberia</option><option value="LBY">Libya</option><option value="LCA">Saint Lucia</option><option value="LIE">Liechtenstein</option><option value="LKA">Sri Lanka</option><option value="LSO">Lesotho</option><option value="LTU">Lithuania</option><option value="LUX">Luxembourg</option><option value="LVA">Latvia</option><option value="MAC">Macao</option><option value="MAF">Saint Martin (French part)</option><option value="MAR">Morocco</option><option value="MCO">Monaco</option><option value="MDA">Moldova, Republic of</option><option value="MDG">Madagascar</option><option value="MDV">Maldives</option><option value="MEX">Mexico</option><option value="MHL">Marshall Islands</option><option value="MKD">North Macedonia</option><option value="MLI">Mali</option><option value="MLT">Malta</option><option value="MMR">Myanmar</option><option value="MNE">Montenegro</option><option value="MNG">Mongolia</option><option value="MNP">Northern Mariana Islands</option><option value="MOZ">Mozambique</option><option value="MRT">Mauritania</option><option value="MSR">Montserrat</option><option value="MTQ">Martinique</option><option value="MUS">Mauritius</option><option value="MWI">Malawi</option><option value="MYS">Malaysia</option><option value="MYT">Mayotte</option><option value="NAM">Namibia</option><option value="NCL">New Caledonia</option><option value="NER">Niger</option><option value="NFK">Norfolk Island</option><option value="NGA">Nigeria</option><option value="NIC">Nicaragua</option><option value="NIU">Niue</option><option value="NLD">Netherlands, Kingdom of the</option><option value="NOR">Norway</option><option value="NPL">Nepal</option><option value="NRU">Nauru</option><option value="NZL">New Zealand</option><option value="OMN">Oman</option><option value="PAK">Pakistan</option><option value="PAN">Panama</option><option value="PCN">Pitcairn</option><option value="PER">Peru</option><option value="PHL">Philippines</option><option value="PLW">Palau</option><option value="PNG">Papua New Guinea</option><option value="POL">Poland</option><option value="PRI">Puerto Rico</option><option value="PRK">Korea, Democratic People's Republic of</option><option value="PRT">Portugal</option><option value="PRY">Paraguay</option><option value="PSE">Palestine, State of</option><option value="PYF">French Polynesia</option><option value="QAT">Qatar</option><option value="REU">Réunion</option><option value="ROU">Romania</option><option value="RUS">Russian Federation</option><option value="RWA">Rwanda</option><option value="SAU">Saudi Arabia</option><option value="SDN">Sudan</option><option value="SEN">Senegal</option><option value="SGP">Singapore</option><option value="SGS">South Georgia and the South Sandwich Islands</option><option value="SHN">Saint Helena, Ascension and Tristan da Cunha</option><option value="SJM">Svalbard and Jan Mayen</option><option value="SLB">Solomon Islands</option><option value="SLE">Sierra Leone</option><option value="SLV">El Salvador</option><option value="SMR">San Marino</option><option value="SOM">Somalia</option><option value="SPM">Saint Pierre and Miquelon</option><option value="SRB">Serbia</option><option value="SSD">South Sudan</option><option value="STP">Sao Tome and Principe</option><option value="SUR">Suriname</option><option value="SVK">Slovakia</option><option value="SVN">Slovenia</option><option value="SWE">Sweden</option><option value="SWZ">Eswatini</option><option value="SXM">Sint Maarten (Dutch part)</option><option value="SYC">Seychelles</option><option value="SYR">Syrian Arab Republic</option><option value="TCA">Turks and Caicos Islands</option><option value="TCD">Chad</option><option value="TGO">Togo</option><option value="THA">Thailand</option><option value="TJK">Tajikistan</option><option value="TKL">Tokelau</option><option value="TKM">Turkmenistan</option><option value="TLS">Timor-Leste</option><option value="TON">Tonga</option><option value="TTO">Trinidad and Tobago</option><option value="TUN">Tunisia</option><option value="TUR">Türkiye</option><option value="TUV">Tuvalu</option><option value="TWN">Taiwan, Province of China</option><option value="TZA">Tanzania, United Republic of</option><option value="UGA">Uganda</option><option value="UKR">Ukraine</option><option value="UMI">United States Minor Outlying Islands</option><option value="URY">Uruguay</option><option value="USA">United States of America</option><option value="UZB">Uzbekistan</option><option value="VAT">Holy See</option><option value="VCT">Saint Vincent and the Grenadines</option><option value="VEN">Venezuela, Bolivarian Republic of</option><option value="VGB">Virgin Islands (British)</option><option value="VIR">Virgin Islands (U.S.)</option><option value="VNM">Viet Nam</option><option value="VUT">Vanuatu</option><option value="WLF">Wallis and Futuna</option><option value="WSM">Samoa</option><option value="YEM">Yemen</option><option value="ZAF">South Africa</option><option value="ZMB">Zambia</option><option value="ZWE">Zimbabwe</option>
            </select>

            {/* Role con handler especial */}
            <label className={`${labelClass} pt-2`}>Role</label>
            <select className={inputClass()} value={role} onChange={handleRoleChange}>
              <option value="estudiante">Student</option>
              <option value="trabajador_rockwell">Rockwell Employee</option>
              <option value="otra_empresa">Other Company</option>
            </select>

            {/* Password + botón — 4 columnas */}
            <div className="col-span-4 flex flex-col items-center gap-5 pt-2">
              <div className="grid items-center gap-x-6" style={{ gridTemplateColumns: 'auto 1fr' }}>
                <label className={labelClass}>Password</label>
                <input type="password" placeholder="securePassword123" className={inputClass()} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center font-semibold">
                  Error al registrarse. Intenta de nuevo.
                </p>
              )}
              <button type="button" onClick={handleRegister}
                className="bg-[#003e7e] text-white font-bold px-10 py-2 rounded-full active:scale-95 transition-transform duration-150">
                {loading ? 'Loading...' : 'Sign Up'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div
        className="w-full py-5 flex flex-col items-center justify-center gap-1 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]"
        style={{ background: 'linear-gradient(to right, #CD163F, #F58025)' }}
      >
        <p className="text-white font-bold text-sm">Already Have an Account?</p>
        <Link to="/login" className="text-white text-sm underline">
          Log in Here
        </Link>
      </div>

    </div>
  )
}

export default SignUp
