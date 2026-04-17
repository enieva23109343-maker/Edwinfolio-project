import React from 'react';
import about1Image from '../assets/about1.jpg';
import about2Image from '../assets/about2.jpg';

function AboutPage() {
  return (
    <>
      <section className="section-container">
        <div className="container about-grid">
          <div className="about-text glass-text">
            <h3>Why I Love Mobile Games</h3>
            <p>
              Mobile games inspire me because they combine creativity, technology,
              and user experience in a way that reaches millions of people instantly.
              I enjoy how mobile games challenge developers to design engaging gameplay
              while keeping performance smooth and interfaces simple.
            </p>
          </div>
          <div className="about-image">
            <img src={about1Image} alt="Learning process" />
          </div>
        </div>
      </section>

      <section className="container">
        <h2>My Learning Journey</h2>
        <div className="timeline">
          <p className="outset">Collaborated on Projects</p>
          <p className="outset">Studying C, Java, and Python</p>
          <p className="outset">Building websites with HTML & CSS</p>
          <p className="outset">Continuously improving my skills</p>
        </div>

        <div className="about-image">
          <img src={about2Image} alt="Learning process" />
        </div>
      </section>

      <blockquote className="quote">
        “Good programs are easy for people to read and understand.”
      </blockquote>
    </>
  );
}

export default AboutPage;