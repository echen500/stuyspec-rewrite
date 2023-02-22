import Head from "next/head";
import {
	Department,
	DepartmentsArray,
	DepartmentsArrayDisplay,
	ReceivedArticle,
} from "../../ts_types/db_types";
import { get_articles_by_department } from "../../db";
import { NextPageContext } from "next";
import styles from "../../styles/[department].module.css";
import MixedArticleDisplay from "../../components/MixedArticleDisplay";

interface Props {
	articles: ReceivedArticle[];
	department_display: string;
}

const Article = (props: Props) => {
	return (
		<div>
			<Head>
				<title>{props.department_display}</title>
			</Head>

			<main id={styles.main}>
				<h1 id={styles.departmentTitle}>{props.department_display}</h1>
				<MixedArticleDisplay
					articles={props.articles}
					display_department={false}
				/>
			</main>
		</div>
	);
};

export default Article;

export async function getServerSideProps(context: NextPageContext) {
	let department_param = String(
		context.query.department
	).toLowerCase() as Department;

	const department_id = DepartmentsArray.findIndex(
		(a) => a == department_param
	);
	if (department_id == -1) {
		// If there is no department found with that param, 404
		return {
			notFound: true,
			props: { attempted_identifier: department_param },
		};
	}

	const department_display = DepartmentsArrayDisplay[department_id];

	let articles = await get_articles_by_department(department_param, 19);
	if (articles.length > 0) {
		return {
			props: {
				articles: JSON.parse(JSON.stringify(articles)),
				department_display: department_display,
			},
		};
	} else {
		return {
			notFound: true,
			props: { attempted_identifier: department_param },
		};
	}
}
