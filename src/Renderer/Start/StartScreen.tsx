import React from "react";
import { Link } from "react-router-dom";

export default function StartScreen() {
	return (
		<section className="startScreen">
			<Link className="link" to={"game"}> Start game </Link>
		</section>
	);
}
