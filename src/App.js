import Navigation from "./components/Navigation/Navigation";
import React from 'react';
import Clarifai from 'clarifai'

import Logo from "./components/Logo/Logo"
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm"
import FaceRecognition from "./components/FaceRecognition/FaceRecognition"
import SignIn from "./components/SignIn/SignIn";
import Rank from "./components/Rank/Rank"
import Register from "./components/Register/Register";

import Particles from "react-tsparticles";
import {loadFull} from "tsparticles";
import './App.css';
import logo from "./components/Logo/Logo";


const app = new Clarifai.App({
	apiKey: 'c626baa27fe44b3bbf60453d0da476f1'
})

const particleOptions = {
	fpsLimit: 120,
	interactivity: {
		events: {
			onClick: {
				enable: true,
				mode: "push",
			},
			onHover: {
				enable: true,
				mode: "repulse",
			},
			resize: true,
		},
		modes: {
			push: {
				quantity: 4,
			},
			repulse: {
				distance: 200,
				duration: 0.4,
			},
		},
	},
	particles: {
		color: {
			value: "#ffffff",
		},
		links: {
			color: "#ffffff",
			distance: 150,
			enable: true,
			opacity: 0.5,
			width: 1,
		},
		collisions: {
			enable: true,
		},
		move: {
			direction: "none",
			enable: true,
			outModes: {
				default: "bounce",
			},
			random: false,
			speed: 3,
			straight: false,
		},
		number: {
			density: {
				enable: true,
				area: 500,
			},
			value: 80,
		},
		opacity: {
			value: 0.5,
		},
		shape: {
			type: "circle",
		},
		size: {
			value: {min: 1, max: 5},
		},
	},
	detectRetina: true,
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
	//     fetch('http://localhost:3000')
	//         .then((response) => response.json())
	//         .then(console.log)
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
		this.setState({imageUrl: this.state.input})
		app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input,)
			.then((response) => {
				if (response) {
					// Fetch this route and send the ID
					fetch('http://localhost:3000/image', {
						method: 'put',
						headers: {'content-type': 'application/json'},
						body: JSON.stringify({
							id: this.state.user.id,
						})
					}).then(response => response.json())
						.then(count => {
							// this.setState({user:{
							// 	entries: count
							// }})
							this.setState(Object.assign(this.state.user, {entries:count}))
						})
				}
				this.displayFaceBox(this.calculateFaceLocation(response))
			})
			.catch(() => console.log("Error with the clarifai API"))
	}

	onRouteChange = (route) => {
		if (route === 'sign-out') {
			this.setState({isSignedIn: false})
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