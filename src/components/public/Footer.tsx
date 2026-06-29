import { FooterBrand } from "@/components/public/SiteLogo";
import { SITE_EMAIL, SITE_NAME } from "@/lib/site";
import { categoryPath } from "@/lib/utils";
import Link from "next/link";

interface FooterCategory {
  name: string;
  slug: string;
}

interface FooterProps {
  categories?: FooterCategory[];
}

export default function Footer({ categories = [] }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-2 border-t-2 border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-[1280px] px-3 py-5 sm:px-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <FooterBrand />
            <p className="mt-3 text-xs leading-relaxed text-neutral-500">
              Independent English news portal — thoughtful reporting and clear analysis.
            </p>
          </div>

          {categories.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">
                Categories
              </h3>
              <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={categoryPath(cat.slug)}
                      className="text-xs text-neutral-600 transition-colors hover:text-brand-800"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">
              Contact
            </h3>
            <ul className="mt-2 space-y-1 text-xs text-neutral-600">
              <li>
                <a href={`mailto:${SITE_EMAIL}`} className="hover:text-brand-800">
                  {SITE_EMAIL}
                </a>
              </li>
              <li>+1 (555) 012-3456</li>
              <li>1200 Press Avenue, New York, NY</li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">
              Follow
            </h3>
            <ul className="mt-2 space-y-1 text-xs text-neutral-600">
              <li><Link href="#" className="hover:text-brand-800">Twitter / X</Link></li>
              <li><Link href="#" className="hover:text-brand-800">Facebook</Link></li>
              <li><Link href="#" className="hover:text-brand-800">YouTube</Link></li>
              <li><Link href="#" className="hover:text-brand-800">RSS Feed</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center justify-between gap-2 border-t border-neutral-200 pt-4 text-[10px] text-neutral-400 sm:flex-row">
          <p>© {currentYear} {SITE_NAME}. All rights reserved.</p>
          <div className="flex gap-3">
            <Link href="#" className="hover:text-brand-800">Privacy</Link>
            <Link href="#" className="hover:text-brand-800">Terms</Link>
            <Link href="#" className="hover:text-brand-800">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
