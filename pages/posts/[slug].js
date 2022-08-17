import React from "react";
import ReactMarkdown from "react-markdown";
import ContentWrapper from "../../components/ContentWrapper.js";
import Footer from "../../components/Footer.js";
import Header from "../../components/Header.js";
import styles from "../../styles/BlogPage.module.css";

const URL = process.env.STRAPIBASEURL;

export async function getStaticPaths() {
  const fetchParams = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `
            {
                blogposts {
                    data {
                        attributes {
                        slug
                        }
                    }
                }
            }
            `,
    }),
  };

  const res = await fetch(`${URL}/graphql`, fetchParams);
  const posts = await res.json();

  const paths = posts.data.blogposts.data.map((post) => {
    return { params: { slug: post.attributes.slug } };
  });

  return {
    paths: paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const fetchParams = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `{
              blogposts(filters: {slug: {eq: "${params.slug}"}}){
                data {
                    attributes {
                    title
                    blogbody
                    description
                        splash {
                        data {
                        attributes {
                            url
                        }
                        }
                    }
                    }
                }
            }
            }`,
    }),
  };

  const res = await fetch(`${URL}/graphql`, fetchParams);
  const { data } = await res.json();

  return {
    props: data.blogposts.data[0].attributes,
    revalidate: 10,
  };
}

function Content({ title, blogbody, splash }) {
  return (
    <ContentWrapper>
      <Header />
      <main className={styles.grid}>
        <h1>{title}</h1>
        <ReactMarkdown>{blogbody}</ReactMarkdown>
      </main>
      <Footer />
    </ContentWrapper>
  );
}

export default Content;
