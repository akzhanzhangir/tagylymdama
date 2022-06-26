import Footer from "../components/Footer";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

function dateParse(date: string) {
  const [day, month, year] = date.split(".");
  return new Date(+year, +month - 1, +day);
}

function stringParse(deadline: Date) {
  const now = new Date();
  return deadline.getTime() < now.getTime();
}

export async function getStaticProps() {
  let { Extractor } = require("markdown-tables-to-json");

  // Fetching Readme
  const res = await fetch(
    "https://raw.githubusercontent.com/danabeknar/kazakhstan-it-internships/main/README.md"
  );
  const awaited = await res.text();

  // Getting the data from table and converting it
  let result = Extractor.extractTable(awaited, "rows", false);
  result = result.slice(1);

  const jobs: Job[] = result.map((val: any[]) => ({
    Name: val[0],
    Internship: val[1],
    Location: val[2] == "?" ? "No Location" : val[2],
    Paid: val[3] == "+" ? true : false,
    Tags: val[4]
      .split(",")
      .filter((val: string | any[]) => val.length < 10)
      .splice(0, 5),
    Deadline:
      val[5] != "?"
        ? dateParse(val[5]).toLocaleString().split(",")[0]
        : "No Date",
    DeadlinePassed: val[5] != "?" ? stringParse(dateParse(val[5])) : false,
    Link: val[6].split('"')[1],
  }));

  jobs.reverse();

  return {
    props: {
      jobs,
    },
    revalidate: 1, // 86400
  };
}

interface Job {
  Name: string;
  Internship: string;
  Location: string;
  Paid: boolean;
  Tags: string[];
  Deadline: string;
  DeadlinePassed: boolean;
  Link: string;
}

interface HomeProps {
  jobs: Job[];
}

function Tags(props: { items: string[] }) {
  return (
    <div className="flex-wrap justify-end hidden ml-2 text-right md:flex">
      {props.items.map((tag, index) => (
        <p className="text-xs  mx-2" key={index}>
          #{tag}
        </p>
      ))}
    </div>
  );
}

function DollarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 fill-green-600	"
      viewBox="0 0 20 20"
    >
      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 fill-red-500"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const Home: NextPage<HomeProps> = (props) => {
  const { jobs } = props;

  return (
    <main>
    <Head>
      <title>Kazakhstan IT Internships</title>
    </Head>
    <div className="flex flex-col justify-center">
      <div className="flex flex-col justify-center mx-auto  max-w-2xl">
        <div className="flex flex-col items-center scroll-mt-24 pt-8">
          <h1 className="font-bold text-3xl md:text-5xl tracking-tight text-center mb-1 text-transparent bg-clip-text bg-gradient-to-r p-1 from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]">
            Kazakhstan IT Internships
          </h1>
          <p className="max-w-xl mt-5 text-md">
            list based on <a className="text-[#3B82F6]" href="https://github.com/danabeknar/kazakhstan-it-internships">this repo</a>.
            Items with border are still active. Green Icon means it is paid. Made using Next.js ISR.
          </p>
        </div>
        <ul className="flex flex-col cursor-pointer	">
          {jobs.map((value, id) => {
            return (
              <div  key={id} className={value.DeadlinePassed ? "" : "rounded-xl bg-gradient-to-r p-1 from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]"}>
              <Link href={value.Link}>
                <div
                  className="flex flex-wrap bg-white rounded-xl p-5 hover:text-[#3B82F6]"
                >
                  <div className="w-1/2 p-2 font-bold text-3xl">{value.Name}</div>
                  <div className="w-1/2 p-2">
                    <Tags items={value.Tags} />
                  </div>
                  <div className="w-1/2 p-2  text-left flex items-center gap-2">
                    <LocationIcon /> {value.Location} {value.Paid ? <DollarIcon /> : <></>}
                  </div>
                  <div className="w-1/2 p-2 text-right">
                    Deadline: {value.Deadline}
                  </div>
                </div>
              </Link>
              </div>
            );
          })}
        </ul>
        <Footer/>

      </div>

    </div>
    </main>
  );
};

export default Home;
