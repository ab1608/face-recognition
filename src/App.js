import Navigation from "./components/Navigation/Navigation";
import React from 'react';

import Logo from "./components/Logo/Logo"
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm"
import FaceRecognition from "./components/FaceRecognition/FaceRecognition"
import SignIn from "./components/SignIn/SignIn";
import Rank from "./components/Rank/Rank"
import Register from "./components/Register/Register";
import {loadFull} from "tsparticles";
import './App.css';


const initialState = {
	input: '',
	imageUrl: '',
	box: {},
	route: 'sign-in',
	isSignedIn: false,
	user: {
		id: '',
		name: '',
		email: '',
		entries: 0,
		joined: ''
	}
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			input: '',
			imageUrl: '',
			box: {},
			route: 'sign-in',
			isSignedIn: false,
			user: {
				id: '',
				name: '',
				email: '',
				entries: 0,
				joined: ''
			}
		}
	}

	// componentDidMount() {
	// 	fetch('http://localhost:3000')
	// 		.then((response) => response.json())
	// 		.then(console.log)
	// }

	loadUser = (data) => {
		this.setState({
			user: {
				id: data.id,
				name: data.name,
				email: data.email,
				entries: data.entries,
				joined: data.joined
			}
		})
	}


	calculateFaceLocation = (facialCoord) => {
		const position = facialCoord["outputs"][0].data.regions[0]["region_info"]["bounding_box"];
		const image = document.getElementById("input-image");
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			leftCol: position.left_col * width,
			topRow: position.top_row * height,
			rightCol: width - (position.right_col * width),
			bottomRow: height - (position.bottom_row * height)
		}
	}

	displayFaceBox = (box) => {
		this.setState({box: box})
	}


	onInputChange = (event) => {
		this.setState({input: event.target.value})
	}

	onPictureSubmit = () => {
		this.setState({imageUrl: this.state.input});
		fetch('http://localhost:3000/imageurl', {
			method: 'post',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify({
				input: this.state.input
			})
		})
			.then(response => response.json())
			.then((response) => {
				if (response) {
					// Fetch this route and send the ID
					fetch('http://localhost:3000/image', {
						method: 'put',
						headers: {'content-type': 'application/json'},
						body: JSON.stringify({
							id: this.state.user.id,
						})
					})
						.then(response => response.json())
						.then(count => {
							// this.setState({user:{
							// 	entries: count
							// }})
							this.setState(Object.assign(this.state.user, {entries: count}))
						})
				}
				this.displayFaceBox(this.calculateFaceLocation(response))
			})
			.catch(() => console.log("Error with the clarifai API"))
	}

	onRouteChange = (route) => {
		if (route === 'sign-out') {
			this.setState({initialState})
		} else if (route === 'home') {
			this.setState({isSignedIn: true})
		}
		this.setState({route: route})
	}


	render() {
		const particlesInit = async (main) => {
			// console.log(main);

			// you can initialize the tsParticles instance (main) here, adding custom shapes or presets
			// this loads the tsparticles package bundle, it's the easiest method for getting everything ready
			// starting from v2 you can add only the features you need reducing the bundle size
			await loadFull(main);
		};

		const particlesLoaded = (container) => {
			// console.log(container);
		};


		const {input, box, imageUrl, isSignedIn, route} = this.state;

		return (
			<div className="App">
				{/*<Particles*/}
				{/*    id="tsparticles"*/}
				{/*    init={particlesInit}*/}
				{/*    loaded={particlesLoaded}*/}
				{/*    options={particleOptions}*/}
				{/*/>*/}
				<Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}></Navigation>
				{route === 'home'
					? <div>
						<Logo></Logo>
						<Rank name={this.state.user.name} entries={this.state.user.entries}></Rank>
						<ImageLinkForm
							onInputChange={this.onInputChange}
							onButtonSubmit={this.onPictureSubmit}
						/>
						<FaceRecognition box={box} imageUrl={imageUrl}></FaceRecognition>
					</div>
					: (
						route === 'sign-in'
							? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}></SignIn>
							: <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}></Register>
					)
				}
			</div>
		);
	}

}

export default App;