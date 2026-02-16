import React from 'react';
import {STATUS_TYPE, StatusTag} from "taltech-styleguide";

interface TagListProps {
    tags: string[],
    handleRemoveTag: (index: number) => void,
}

const TagList: React.FC<TagListProps> = ({tags, handleRemoveTag}) => {
    return (
        <div className="d-flex gap-2 flex-wrap">
            {tags?.map((tag, index) => (
                <div key={index} className="tag-container">
                    <StatusTag id={index.toString()} type={STATUS_TYPE.INFO} className="pe-3 position-relative">
                        {tag}
                        <span
                            className="tag-remove"
                            onClick={() => handleRemoveTag(index)}
                        >
                            X
                        </span>
                    </StatusTag>
                </div>
            ))}
        </div>
    );
};

export default TagList;
