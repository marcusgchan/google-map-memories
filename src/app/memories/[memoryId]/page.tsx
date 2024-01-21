import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function Memory() {
  const backgroundImageStyle = {
    background:
      "linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.00) 13.5%, rgba(0, 0, 0, 0.00) 85.04%, #000 91.85%), linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.00) 21.5%, #000 100%), url(/memory-sample.png)",
    backgroundSize: "contain",
    backgroundPosition: "50%",
    backgroundRepeat: "no-repeat",
    height: "100vh",
  };

  return (
    <div
      className="relative h-screen overflow-hidden"
      style={backgroundImageStyle}
    >
      <div className="text-lg">
        <a href="../">&#8592; Back</a>
      </div>
      <Card className="bg-black  bg-opacity-50 fixed bottom-16 left-16 w-5/12 h-64 overflow-auto">
        <CardHeader className="m-1">
          <CardTitle className="text-2xl">My dad's morning walk</CardTitle>
          <CardDescription>April 2017</CardDescription>
        </CardHeader>
        <CardContent>
          Stumbling upon this unexpected treasure on Google Maps feels like
          stumbling upon a cherished memory lane – there's my uncle, doing what
          he loved most, tending to his garden at home. The soft glow of the sun
          paints a familiar warmth on the scene, a scene that holds so much more
          than pixels on a screen. I can almost hear his laughter in the air and
          see the twinkle in his eye as he gets his hands dirty in the soil.
          Those gardening gloves, worn and weathered, tell tales of the
          countless hours he spent creating a little haven in his own backyard.
          It's like I can smell the earth and feel the breeze just looking at
          the photo, transporting me to the heart of his sanctuary. There's a
          quiet determination on his face, the kind that was uniquely him. This
          snapshot captures the essence of his passion for nurturing life,
          reminding me of the countless conversations we had about his green
          companions. It's not just a photo; it's a portal to the ordinary yet
          extraordinary moments we shared. In this candid shot, he isn't just
          gardening; he's leaving a piece of himself in the soil, a legacy of
          love and care that will forever bloom in my heart. Here's to the man
          who turned gardening into an art form and made every moment a
          masterpiece – my uncle, the green thumb with a heart of gold.
        </CardContent>
      </Card>
    </div>
  );
}
