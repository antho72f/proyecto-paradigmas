import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";

export function Footer({ brandName, brandLink }) {
  const year = new Date().getFullYear(); // Obtiene el año actual

  return (
    <footer className="py-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
        <Typography variant="small" className="font-normal text-inherit">
          &copy; {year}
        </Typography>
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  brandName: "Creative Tim",
  brandLink: "https://www.creative-tim.com",
};

Footer.propTypes = {
  brandName: PropTypes.string,
  brandLink: PropTypes.string,
};

export default Footer;
