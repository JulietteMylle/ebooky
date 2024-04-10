

// const CoverAtom = ({ title, description, image, imageDark }: CoverAtomProps) => {
//     const { theme } = useTheme();
const CoverAtom = ({ title, description, Icon }) => {
    return (
        <div className="flex flex-col items-center gap-2">
            {/* <img src={theme === 'light' ? image : imageDark} alt="" className="w-16 h-16 " /> */}
            <Icon className="w-16 h-16" />
            <p className="text-xl">{title}</p>
            <p>{description}</p>
        </div>
    );
};

export default CoverAtom;
