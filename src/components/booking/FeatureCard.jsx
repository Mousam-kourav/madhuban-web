const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="group bg-primary-gray2 border border-primary-gray2 flex items-center justify-center flex-col p-8 rounded-[2rem] hover:bg-white/[0.04] transition-all hover:border-green-500/20">
    <div className="bg-[#ffffff24] w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
      <Icon className="text-white w-7 h-7" />
    </div>
    <h3 className="text-xl  mb-4 primary-font-family text-white ">{title}</h3>
    <p className="text-white text-sm  leading-relaxed font-medium">
      {description}
    </p>
  </div>
);

export default FeatureCard;
