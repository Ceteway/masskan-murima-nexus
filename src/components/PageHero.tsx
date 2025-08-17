import React from 'react';

interface PageHeroProps {
  title: string;
  subtitle: string;
  imageUrl: string;
}

const PageHero: React.FC<PageHeroProps> = ({ title, subtitle, imageUrl }) => {
  return (
    <section
      className="relative py-20 bg-cover bg-center"
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            {title}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto animate-fade-in">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PageHero;
