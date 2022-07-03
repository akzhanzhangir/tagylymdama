import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

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
    "https://raw.githubusercontent.com/danabeknar/kazakhstan-it-internships/main/README.md",
    {
      method: 'GET',
    }
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
      .map((val: string) => val.replace(/[\])}[{(]/g, "").trim())
      .splice(0, 5),
    Deadline:
      val[5] != "?" ? dateParse(val[5]).toLocaleDateString() : "No Date",
    DeadlinePassed: val[5] != "?" ? stringParse(dateParse(val[5])) : false,
    Link: val[6].split('"')[1],
  }));

  jobs.reverse();

  return {
    props: {
      jobs,
    },
    revalidate: 86400, // 86400
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
    <div className="hidden flex-wrap justify-end gap-2 text-right md:flex">
      {props.items.map((tag, index) => (
        <p className="text-xs" key={index}>
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

      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col pt-4 sm:pt-8">
          <h1 className="px-5 py-2 text-3xl font-bold tracking-tight dark:text-white md:text-6xl">
            Kazakhstan 🇰🇿
            <br />
            IT Internships
          </h1>
          <p className="px-5 py-2 text-sm tracking-tight dark:text-white md:text-xl">
            list is from{" "}
            <a
              className="text-blue-500"
              href="https://github.com/danabeknar/kazakhstan-it-internships"
            >
              this repo
            </a>
            . Made using Next.js ISR.
            <br />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Highlighted
            </span>{" "}
            items are not past deadline. <br />
            <span className="flex flex-row items-center gap-2">
              This icon <DollarIcon /> means it is paid.
            </span>
          </p>
        </div>
        <div className="flex cursor-pointer flex-col dark:text-white">
          {jobs.map((value, id) => {
            return (
              <div
                key={id}
                className={cn(
                  value.DeadlinePassed
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
                  "my-2 mx-5  rounded-xl p-1 sm:mx-0"
                )}
              >
                <Link href={value.Link}>
                  <div className="flex flex-wrap rounded-xl bg-white p-2 hover:text-blue-500 dark:bg-black ">
                    <div className="w-full p-2 text-2xl font-bold tracking-[-.075em] sm:w-1/2 sm:text-3xl">
                      {value.Name}
                    </div>
                    <div className="w-0 p-0 sm:w-1/2 sm:p-2">
                      <Tags items={value.Tags} />
                    </div>
                    <div className="flex w-1/2 items-center gap-2 p-2  text-sm sm:text-base ">
                      <LocationIcon />{" "}
                      <span className="truncate">{value.Location}</span>
                      {value.Paid ? <DollarIcon /> : <></>}
                    </div>
                    <div className="w-1/2 p-2 text-right  text-sm sm:text-base">
                      {value.Deadline}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
          <footer className="mt-5 h-10  p-4 text-black dark:text-white">
            <Link href="https://github.com/djakish"> my github </Link>
          </footer>
        </div>
      </div>
    </main>
  );
};

export default Home;
