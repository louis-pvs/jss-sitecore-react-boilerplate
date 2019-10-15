A modify version of jss scaffold react boilerplate, check out JSS official documentation for more details implementation.

> Develop front-end in sitecore should'nt be hard.

## Objectives of modification

- To be able to use `yarn`, beacause why not?
- up to date package versions, because when searching for documentations I want to look for the up to date solution, and most of the bugs might have already fixed with the latest update. _(that being said please don't report any bug to JSS if there is any packages incompatible, this boilerplate still working as expected after all the major updates, so far.)_

## What has been added into the boilerplate

Yes, you probably don't need any of these packages.

- linting packages integrate with `prettier`, `./src/*`, `./scripts/*` & `./sitecore/*` been lint with prettier by running `npm run lint` or `yarn lint`. Because I want to let prettier do the dirty job for me, Packages:
  - eslint
    - `prettier-eslint`
    - `prettier-eslint-cli`
  - styling
    - `prettier-styleling`
    - `stylelint-config-prettier`
    - `stylelint-prettier`
- git hook to trigger the linting, because linting is important before they share with other team member. Packages:
  - `lint-stage`
  - `husky`
- Accessibility packages, `eslint-plugin-jsx-a11y` already come out of the box, but `react-axe` has added on top of that and being use only in development mode. Because I want to audit accessibility on the final rendered DOM. Pacakge:
  - `react-axe`
- Overrides webpack config using, in order to add extra webpack config you might need to `eject` out from `create-react-app`(CRA) by default. But I still want all the goodies provided by CRA with just some minor configuration on top of it. Hence, I added `./config-overrides.js` and some packages scripts has [modify accordingly](https://github.com/timarney/react-app-rewired#3-flip-the-existing-calls-to-react-scripts-in-npm-scripts-for-start-build-and-test). Packages:
  - `react-app-rewired`
- Analyze builded bundle by run `yarn analyze`, because I want to see what see what has been added by JSS. Packages:
  - `source-map-explorer`
- Style guide, because I want to develop my "dumb" component and view them without added them into any JSS route or page, [Styleguidist](https://react-styleguidist.js.org) allow me to do so. Hence, I modify `./scripts/scaffold-component` to scaffold a default styleguide template when using `jss scaffold` command by passing `--styleguide` or `-S`. Packages:
  - `react-styleguidist`