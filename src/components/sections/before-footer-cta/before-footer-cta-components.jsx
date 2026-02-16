import ButtonComponent from "../button/button-component";
import GroupedHeadingComponent from "../grouped-heading/grouped-heading-component";

const BeforeFooterCTA = () => {
	return (
		<div className="bg-white md:p-6">
  <section className="relative md:rounded-xl rounded-none shadow-lg shadow-pink-700/30 bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 flex flex-col justify-center items-center w-full mx-auto my-0 px-2.5 py-[80px] border-b-2 border-pink-400 overflow-hidden group transition-all duration-700 hover:shadow-2xl hover:shadow-pink-700/50">
    
    {/* Glass Overlay on Hover */}
    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 backdrop-blur-[2px] group-hover:backdrop-blur-[1px] transition-all duration-700"></div>
    
    {/* Animated Gradient Background */}
    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/0 via-white/10 to-pink-600/0 opacity-0 group-hover:opacity-100 blur-xl transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
    
    {/* Animated Floating Elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000 delay-300"></div>
      
      {/* Floating Blood Drops */}
      <div className="absolute top-[20%] left-[15%] text-white/10 text-4xl animate-float-slow">🩸</div>
      <div className="absolute bottom-[30%] right-[20%] text-white/10 text-5xl animate-float animation-delay-700">❤️</div>
      <div className="absolute top-[60%] left-[30%] text-white/10 text-3xl animate-float-slow animation-delay-1000">🩸</div>
    </div>

    {/* Main Content */}
    <div className="relative w-[min(100%_-_15px,1250px)] flex flex-row justify-center mx-auto my-0 p-2.5 z-10">
      <div className="flex flex-col justify-center items-center w-full relative z-[25] overflow-hidden transform group-hover:scale-105 transition-all duration-700">
        
        {/* Glowing Effect on Hover */}
        <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full opacity-0 group-hover:opacity-30 scale-0 group-hover:scale-150 transition-all duration-700"></div>
        
        <GroupedHeadingComponent
          subheadingText="Be a hero, save a life today!"
          headingText="Donate Blood, Donate Hope."
          mode="light"
          position="center"
          boxWidth="large"
        />

        <div className="relative mt-6">
          {/* Pulsing Ring Effect */}
          <div className="absolute inset-0 rounded-full border-2 border-white/30 opacity-0 group-hover:opacity-100 animate-ping"></div>
          
          {/* Button with Enhanced Hover */}
          <div className="relative transform group-hover:scale-110 group-hover:translate-y-[-4px] transition-all duration-300">
            <ButtonComponent
              buttonText="I Want to Donate"
              buttonLink="/donate-blood"
              buttonType="line"
            />
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Shine Line */}
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
    
    {/* Corner Accents */}
    <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-white/30 opacity-0 group-hover:opacity-100 transform -translate-x-full -translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500"></div>
    <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-white/30 opacity-0 group-hover:opacity-100 transform translate-x-full -translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500"></div>
    <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-white/30 opacity-0 group-hover:opacity-100 transform -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500"></div>
    <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-white/30 opacity-0 group-hover:opacity-100 transform translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500"></div>
  </section>
</div>
	);
};

export default BeforeFooterCTA;
