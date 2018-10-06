import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import CreditCardInput from 'react-credit-card-input';
import Cards from 'react-credit-cards';
import './App.css';


const styles = theme => ({
  root: {
    display: 'block',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

class App extends Component {

  container = null;
  state = {
    completo: false,
    nombre: '',
    mail: '',
    pais: '',
    tipo: '',
    cardNum: '',
    cardExp: '',
    cardCvv: '',
    error: false,
  };

cambiarTipo = (tipo) => {this.setState({tipo})}

validarDatos = () => {
  const {tipo, nombre, mail, pais, cardNum, cardExp, cardCvv } = this.state;

  this.ocultarError();

  if (nombre.length < 4 || nombre.indexOf(' ') === -1) {
    this.mostrarError();
    return;
  }
  if (mail.indexOf('@') === -1 || mail.indexOf('.') === -1){
    this.mostrarError();
    return;
  }
  if (pais === ''){
    this.mostrarError();
    return;
  }



  this.crearUsuario();

}

ocultarError = () => {
  this.setState({ error: false })
}

mostrarError = () => {
  this.setState({ error: true })
}

crearUsuario = () => {
fetch('https://server-subscripcion-jsbrbnwqfv.now.sh/subscripciones', {
method: 'POST', 
body: JSON.stringify(this.state),
headers:{
  'Content-Type': 'application/json'
}
}).then(res => res.json())
.catch(error => console.error('Error:', error))
.then(response => this.setState({ completo: true }))
}

  render() {
    const { classes } = this.props;
    const {error, tipo, nombre, mail, pais, cardNum, cardExp, cardCvv, completo } = this.state;
  
    if (completo) {
      return(
      <h1 class="mensajeFinal">Gracias Por Elegirnos!!
      <br></br><br></br><br></br>
        <a href="http://localhost:3000/">&laquo; Página Inicial</a>
      </h1>
      
      );

    }

    return (
      <div class="body">
      
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel compoGendernent="legend"><h1 class="title">Elige tu plan:</h1></FormLabel>
          <RadioGroup
            aria-label="tipo"
            name="tipo"
            className={classes.group}
            value={tipo}
            onChange={(evento) => this.setState({ tipo: evento.target.value }) }
          >
            <FormControlLabel  value="free" control={<Radio />} label="Free (Un mes gratuito)" />
            <FormControlLabel value="premium" control={<Radio />} label="Premium (US$10)" />
  
          </RadioGroup>
        </FormControl>
        {(error) && 
        <p class="Error">Por favor completa todos los campos</p>
      }

        <div className="NombreMailPais">
         {tipo !== '' && 
            <FormControl component="fieldset" className={classes.formControl}>
              <TextField
                label="Nombre y Apellido"
                defaultValue=""
                className={classes.textField}
                margin="normal"
                value={nombre}
                onChange={(evento) => this.setState({ nombre: evento.target.value }) }
              />
            </FormControl>
        }
          {tipo !== '' && 
            <FormControl component="fieldset" className={classes.formControl}>
              <TextField
                label="E-Mail"
                defaultValue=""
                className={classes.textField}
                margin="normal"
                value={mail}
                onChange={(evento) => this.setState({ mail: evento.target.value }) }
              />
            </FormControl>
        }
         {tipo!== '' &&  
          <FormControl>
            
             País: <CountryDropdown onChange={(pais) => this.setState({ pais })} value={pais}></CountryDropdown>
            </FormControl>
      }
      </div>
       {tipo === 'premium' && 
         
        (<div className='tarjeta'>
        <CreditCardInput cardCVCInputRenderer={({ handleCardCVCChange, props }) => (
            <input {...props} onChange={handleCardCVCChange(e => this.setState({ cardCvv: e.target.value }))}/>)}
          cardExpiryInputRenderer={({handleCardExpiryChange,props}) => (
            <input {...props} onChange={handleCardExpiryChange(e =>	this.setState({ cardExp: e.target.value }))}/>)}
          cardNumberInputRenderer={({handleCardNumberChange,props}) => (
            <input {...props}	onChange={handleCardNumberChange(e =>	this.setState({ cardNum: e.target.value }))}/>)}/>
        <Cards number={this.state.cardNum} name={this.state.nombre} expiry={this.state.cardExp} cvc={this.state.cvc} focused={0} /></div>)
      }
   
      {tipo !== '' &&
      <div className="Boton">
       <Button variant="contained" size= "large" color="primary" onClick={() => this.validarDatos()}>
      Enviar
      </Button>
     </div>
     }
      </div>
      </div>
      
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);