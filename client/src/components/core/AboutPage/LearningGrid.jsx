import React from "react";
import HighlightText from "../../../components/core/HomePage/HighlightText";
import CTAButton from "../../../components/core/HomePage/Button";

const LearningGridArray = [
  {
    order: -1,
    heading: "Premier Online Interviews for",
    highlightText: "Tech Talents Globally",
    description:
      "Interrospot connects top talents with leading tech companies, offering a seamless, real-time interview experience that transcends geographical boundaries.",
    BtnText: "Discover How",
    BtnLink: "/about",
  },
  {
    order: 1,
    heading: "Real-World Interview Scenarios",
    description:
      "Our platform simulates real-world interview scenarios to prepare candidates for the challenges of tech interviews, aligning closely with industry expectations.",
  },
  {
    order: 2,
    heading: "Interactive Learning Experience",
    description:
      "Interrospot leverages cutting-edge technology to provide an interactive, engaging learning and interview preparation experience.",
  },
  {
    order: 3,
    heading: "Certification of Achievement",
    description:
      "Successful candidates receive certifications, validating their skills and making them more attractive to tech employers.",
  },
  {
    order: 4,
    heading: "Auto-Evaluation System",
    description:
      "Our advanced auto-evaluation system provides instant feedback, helping candidates to improve continuously.",
  },
  {
    order: 5,
    heading: "Industry-Ready Candidates",
    description:
      "Interrospot ensures that candidates are fully prepared and industry-ready, bridging the gap between learning and employment.",
  },
];

const LearningGrid = () => {
  return (
    <div className="grid mx-auto w-[350px] xl:w-fit grid-cols-1 xl:grid-cols-4 mb-12">
      {LearningGridArray.map((card, i) => {
        return (
          <div
            key={i}
            className={`${i === 0 ? "xl:col-span-2 xl:h-[294px]" : ""} ${card.order % 2 === 1
                ? "bg-richblack-700 h-[294px]"
                : card.order % 2 === 0
                  ? "bg-richblack-800 h-[294px]"
                  : "bg-transparent"
              } ${card.order === 3 ? "xl:col-start-2" : ""}`}
          >
            {card.order < 0 ? (
              <div className="xl:w-[90%] flex flex-col gap-3 pb-10 xl:pb-0">
                <div className="text-4xl font-semibold ">
                  {card.heading}
                  <HighlightText text={card.highlightText} />
                </div>
                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>

                <div className="w-fit mt-2">
                  <CTAButton active={true} linkto={card.BtnLink}>
                    {card.BtnText}
                  </CTAButton>
                </div>
              </div>
            ) : (
              <div className="p-8 flex flex-col gap-8">
                <h1 className="text-richblack-5 text-lg">{card.heading}</h1>

                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LearningGrid;