import React from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import useOnclickOutside from 'react-cool-onclickoutside';
import {GoogleApiWrapper} from 'google-maps-react';
import './style.css';
import PlaceAutocomplete2 from './PlaceAutocomplete2';


const PlacesAutocomplete = () => {
    const {
      ready,
      value,
      suggestions: { status, data },
      setValue,
      clearSuggestions
    } = usePlacesAutocomplete({
      requestOptions: { counties: ['ua'] },
      debounce: 300
    });
    const registerRef = useOnclickOutside(() => {
      clearSuggestions();
    });
  
    const handleInput = e => {
      setValue(e.target.value);
    };
  
    const handleSelect = ({ description }) => () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter as "false"
      setValue(description, false);
      clearSuggestions();
  
      getGeocode({ address: description })
        .then(results => getLatLng(results[0]))
        .then(({ lat, lng }) => {
          console.log('📍 Coordinates: ', { lat, lng });
        }).catch(error => {
          console.log('😱 Error: ', error)
        });
    };
  
    const renderSuggestions = () =>
      data.map(suggestion => {
        const {
          id,
          structured_formatting: { main_text, secondary_text }
        } = suggestion;
        return (
            <div className="dropdown">
                <ul className="droplist">
                <li
                    key={id}
                    onClick={handleSelect(suggestion)}
                >
                    <strong>{main_text}</strong> <small>{secondary_text}</small>
                </li>
                </ul>
            </div>
        );
      });
  
    return (
      <div ref={registerRef}>
        <input
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Where are you going?"
        />
        
        {/* We can use the "status" to decide whether we should display the dropdown or not */}
        {status === 'OK' && <ul>{renderSuggestions()}</ul>}
      </div>
    );
};

export default GoogleApiWrapper({
    apiKey: "AIzaSyAiD7aL5E52w5iQHBlYuxXJ3IjFjG6TEDU"
})(PlacesAutocomplete);