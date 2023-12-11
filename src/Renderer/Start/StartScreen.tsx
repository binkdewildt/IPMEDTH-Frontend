import React from "react";
import { Link } from "react-router-dom";

export default function StartScreen() {
	const [isExplanationOpen, setIsExplanationOpen] = useState(false);

	//todo: resize-animation startImg
	//todo: verplaats uitlegOverlay naar spel
	return (
		<section className="startScreen">
			<Link className="link" to={"game"}> Start game </Link>
		</section>
	);
}
