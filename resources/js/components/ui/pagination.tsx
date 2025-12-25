import { Link } from '@inertiajs/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    links: PaginationLink[];
}

export default function Pagination({ links }: Props) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap justify-center gap-1 mt-6">
            {links.map((link, key) => {
                let label = link.label;
                if (label.includes('&laquo;')) label = 'Previous';
                if (label.includes('&raquo;')) label = 'Next';

                return link.url === null ? (
                    <div
                        key={key}
                        className="px-3 py-1 text-sm text-muted-foreground border rounded bg-muted/50 cursor-not-allowed flex items-center"
                    >
                        {label === 'Previous' && <FiChevronLeft className="w-4 h-4 mr-1" />}
                        {label === 'Next' && <FiChevronRight className="w-4 h-4 ml-1" />}
                        {label !== 'Previous' && label !== 'Next' && <span dangerouslySetInnerHTML={{ __html: label }} />}
                        {(label === 'Previous' || label === 'Next') && <span>{label}</span>}
                    </div>
                ) : (
                    <Link
                        key={key}
                        href={link.url}
                        className={`px-3 py-1 text-sm border rounded transition-colors flex items-center ${link.active
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background hover:bg-muted text-foreground'
                            }`}
                    >
                        {label === 'Previous' && <FiChevronLeft className="w-4 h-4 mr-1" />}
                        {label === 'Next' && <FiChevronRight className="w-4 h-4 ml-1" />}
                        {label !== 'Previous' && label !== 'Next' && <span dangerouslySetInnerHTML={{ __html: label }} />}
                        {(label === 'Previous' || label === 'Next') && <span>{label}</span>}
                    </Link>
                );
            })}
        </div>
    );
}
