# Selenium (Java) Interview Questions & Answers

A comprehensive guide covering Selenium WebDriver with Java — from fundamentals to framework design, coding challenges, and managerial scenarios, compiled from real interview experiences.

---

## Table of Contents

1. [Deloitte — Senior QA Interview Questions](#1-deloitte--senior-qa-interview-questions)
   - [Round 1: Technical](#round-1-technical)
   - [Round 2: Techno-Managerial](#round-2-techno-managerial)
2. [Coforge — QA Automation Interview Questions](#2-coforge--qa-automation-interview-questions)
3. [WestPharma — QA Automation Interview Questions (3+ Years)](#3-westpharma--qa-automation-interview-questions-3-years)
4. [Wipro — QA Automation Testing Interview Questions (4 Years Experience, L1)](#4-wipro--qa-automation-testing-interview-questions-4-years-experience-l1)
5. [Licious — SDET Interview Questions](#5-licious--sdet-interview-questions)
6. [Oracle — QA Interview Questions (4+ Years Experience)](#6-oracle--qa-interview-questions-4-years-experience)
7. [HCLTech — QA Interview Questions](#7-hcltech--qa-interview-questions)
   - [Round 1: Core Java & Automation](#round-1-core-java--automation)
   - [Round 2: Selenium, TestNG & CI/CD](#round-2-selenium-testng--cicd)
   - [Client Interview](#client-interview)
8. [GlobalLogic — Interview Questions](#8-globallogic--interview-questions)
   - [Round 1: Technical](#round-1-technical-1)
   - [Round 2: Techno-Managerial Round](#round-2-techno-managerial-round)
   - [Round 3: HR](#round-3-hr)
9. [Qualitest — QA Automation (3–5 YOE) Interview Questions](#9-qualitest--qa-automation-3-5-yoe-interview-questions)
   - [Round 1: Core Java, Selenium & Playwright](#round-1-core-java-selenium--playwright)
   - [Round 2: Framework, API & CI/CD](#round-2-framework-api--cicd)
   - [Round 3: Scenario-Based & Debugging](#round-3-scenario-based--debugging)
10. [LTIMindtree — SDET / Automation Interview Questions (25 LPA)](#10-ltimindtree--sdet--automation-interview-questions-25-lpa)
11. [EPAM Gurugram — Interview Questions (Medium + Hard, 50% Hike)](#11-epam-gurugram--interview-questions-medium--hard-50-hike)
    - [Round 1 (Virtual): 1 Hour 30 Minutes](#round-1-virtual-1-hour-30-minutes)
    - [Round 2: 1 Hour 30 Minutes](#round-2-1-hour-30-minutes-1)

---

## 1. Deloitte — Senior QA Interview Questions

*One of the candidates recently attended a Senior QA interview at Deloitte and shared the questions they encountered. Shared here to help QA professionals and aspiring testers prepare more effectively.*

---

## Round 1: Technical

### 1. Explain about yourself and your roles and responsibilities

**Sample Answer:**

"Hi, I'm [Your Name], a Senior QA Automation Engineer with X years of experience specializing in Selenium WebDriver with Java. I currently work at [Company] where I own the automation framework for our web application testing.

**My day-to-day responsibilities:**
- Designing and maintaining a Selenium + Java automation framework built on the Page Object Model
- Writing and reviewing test cases for functional, regression, and smoke suites
- Integrating tests into CI/CD pipelines (Jenkins) with TestNG for execution and reporting
- Performing API testing using RestAssured/Postman alongside UI automation
- Mentoring junior QAs on framework usage and best practices
- Collaborating with developers on defect triage and root-cause analysis

**Key achievements:**
- Built a Selenium/TestNG framework from scratch covering 300+ regression scenarios
- Reduced regression cycle time by integrating parallel execution via TestNG suite XML
- Set up automatic screenshot capture and Extent Reports for failure analysis

**Tech stack:** Selenium WebDriver, Java, TestNG/JUnit, Maven, Cucumber BDD, Jenkins, Git, RestAssured, JMeter."

**Tips:**
- Keep it under 90 seconds
- Structure: Intro → Current role → Key skills → Achievement
- Quantify impact wherever possible ("reduced regression time by X%")

---

### 2. Write Java code to reverse a string while preserving whitespace

**Approach:** Extract only non-space characters, reverse them, then rebuild the string by placing reversed characters back into the non-space positions, keeping spaces exactly where they were.

```java
public class ReverseStringPreserveSpaces {
    public static void main(String[] args) {
        String input = "Selenium is  fun";
        System.out.println(reverse(input));
    }

    public static String reverse(String input) {
        char[] chars = input.toCharArray();
        int left = 0, right = chars.length - 1;

        while (left < right) {
            if (chars[left] == ' ') {
                left++;
            } else if (chars[right] == ' ') {
                right--;
            } else {
                char temp = chars[left];
                chars[left] = chars[right];
                chars[right] = temp;
                left++;
                right--;
            }
        }
        return new String(chars);
    }
}
// Input:  "Selenium is  fun"
// Output: "nuf  si muineleS"
```

**Key points:**
- Two-pointer technique — `O(n)` time, `O(n)` space for the char array
- Skip over whitespace on either pointer without swapping
- Whitespace stays at the exact same index in the output

---

### 3. Find the second-largest employee salary using SQL

```sql
-- Method 1: Using LIMIT/OFFSET
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;

-- Method 2: Using subquery (MAX excluding the highest)
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);

-- Method 3: Using DENSE_RANK (handles ties correctly, per department too)
SELECT salary
FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
) ranked
WHERE rnk = 2;
```

**Why `DISTINCT` / `DENSE_RANK` matter:** If two employees share the highest salary, a plain `ORDER BY salary DESC LIMIT 1,1` without `DISTINCT` would return the *same* top salary again instead of the true second-highest. `DENSE_RANK()` is the most robust choice for interviews since it also scales to "find the Nth highest."

---

### 4. Explain joins and their different types

Joins combine rows from two or more tables based on a related column.

| Join Type | Description |
|-----------|-------------|
| **INNER JOIN** | Returns only matching rows in both tables |
| **LEFT JOIN (LEFT OUTER)** | All rows from left table + matched rows from right (NULL if no match) |
| **RIGHT JOIN (RIGHT OUTER)** | All rows from right table + matched rows from left (NULL if no match) |
| **FULL OUTER JOIN** | All rows from both tables, NULL where no match exists on either side |
| **CROSS JOIN** | Cartesian product — every row of table A with every row of table B |
| **SELF JOIN** | A table joined with itself (e.g., employee-manager hierarchy) |

```sql
-- INNER JOIN example
SELECT e.name, d.department_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;

-- SELF JOIN example — employee and their manager
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
```

---

### 5. What is LinkedHashMap? Explain its use

`LinkedHashMap` is a `Map` implementation that maintains **insertion order** (or optionally access order), unlike `HashMap` which gives no ordering guarantee.

```java
import java.util.LinkedHashMap;
import java.util.Map;

Map<String, String> testData = new LinkedHashMap<>();
testData.put("username", "admin");
testData.put("password", "Test1234");
testData.put("environment", "QA");

for (Map.Entry<String, String> entry : testData.entrySet()) {
    System.out.println(entry.getKey() + " = " + entry.getValue());
}
// Prints in the EXACT order items were inserted:
// username = admin
// password = Test1234
// environment = QA
```

**Use in Selenium/automation context:**
- Storing test data or configuration where the **order of execution matters** (e.g., steps in a data-driven test)
- Maintaining a predictable order when iterating over locators or test steps read from a properties/JSON file
- Building an LRU cache (via the access-order constructor `new LinkedHashMap<>(cap, 0.75f, true)`)

`HashMap` vs `LinkedHashMap` vs `TreeMap`:

| Map | Ordering |
|-----|----------|
| `HashMap` | No guaranteed order |
| `LinkedHashMap` | Insertion order preserved |
| `TreeMap` | Sorted by key (natural or Comparator) |

---

### 6. Explain black-box and white-box testing

| Aspect | Black-Box Testing | White-Box Testing |
|--------|-------------------|--------------------|
| Knowledge required | No internal code knowledge needed | Requires knowledge of internal code/structure |
| Performed by | QA/Testers | Developers (mostly), SDETs |
| Focus | Functionality, inputs/outputs | Code paths, branches, logic |
| Techniques | Equivalence partitioning, boundary value analysis | Statement/branch/path coverage |
| Example | Verifying a login form works with valid/invalid credentials | Verifying every `if/else` branch in the login validation method is executed |

**In Selenium automation context:** Selenium test automation itself is largely **black-box** — we drive the UI and assert on outputs without knowing the underlying implementation. Unit tests written by developers (JUnit-based, testing individual methods/classes) are white-box.

---

### 7. Difference between an exception and an error

| Aspect | Exception | Error |
|--------|-----------|-------|
| Recoverability | Recoverable — can be caught and handled | Generally unrecoverable — indicates a serious problem |
| Package | `java.lang.Exception` | `java.lang.Error` |
| Cause | Application-level issues (bad input, network failure) | JVM-level issues (`OutOfMemoryError`, `StackOverflowError`) |
| Handling | Should be caught with try-catch | Should NOT typically be caught/handled by application code |
| Selenium example | `NoSuchElementException`, `TimeoutException` | `OutOfMemoryError` when a browser session leaks memory over a long run |

```java
try {
    driver.findElement(By.id("submit")).click();
} catch (NoSuchElementException e) {
    // Exception — recoverable, we can log/retry/fail the test gracefully
    System.out.println("Element not found: " + e.getMessage());
}
```

Both `Exception` and `Error` extend `Throwable`, but only `Exception` (and its subclasses) is meant to be handled in normal application/test code.

---

### 8. Difference between findElement() and findElements()

| Aspect | `findElement()` | `findElements()` |
|--------|------------------|-------------------|
| Return type | Single `WebElement` | `List<WebElement>` |
| If no match found | Throws `NoSuchElementException` | Returns an **empty list** (no exception) |
| Use case | When exactly one element is expected | When multiple/unknown number of elements are expected |

```java
// Single element
WebElement loginBtn = driver.findElement(By.id("login"));
loginBtn.click();

// Multiple elements
List<WebElement> productCards = driver.findElements(By.className("product-card"));
System.out.println("Total products: " + productCards.size());
for (WebElement card : productCards) {
    System.out.println(card.getText());
}

// Safe existence check using findElements (avoids exception handling)
boolean isErrorDisplayed = driver.findElements(By.cssSelector(".error-msg")).size() > 0;
```

**Practical tip:** `findElements()` is commonly used to safely check whether an element exists on the page without wrapping code in a try-catch for `NoSuchElementException`.

---

### 9. Difference between implicit and explicit waits

| Aspect | Implicit Wait | Explicit Wait |
|--------|---------------|----------------|
| Scope | Applies globally to the entire `WebDriver` instance | Applies to a specific element/condition |
| Behavior | Polls the DOM for a fixed time before throwing `NoSuchElementException` | Waits for a specific `ExpectedCondition` to become true |
| Flexibility | Same timeout for every `findElement` call | Different conditions/timeouts per element |
| Code | `driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));` | `WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));` |

```java
// Implicit wait — set once, applies to ALL findElement calls
driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
WebElement el = driver.findElement(By.id("username")); // waits up to 10s

// Explicit wait — targeted condition
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
WebElement submitBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("submit")));
submitBtn.click();

wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("dashboard")));
wait.until(ExpectedConditions.textToBePresentInElement(By.id("status"), "Success"));
```

**Important:** Never mix implicit and explicit waits carelessly — combining both can lead to unpredictable, compounding wait times (e.g., an explicit wait polling every 500ms while implicit wait adds 10s to each failed lookup). Best practice: use **explicit waits only** in a modern framework, and set implicit wait to 0.

---

### 10. Write Selenium code to automate a calendar WebElement

Calendars vary by widget (jQuery UI datepicker, Bootstrap datepicker, custom React date-picker), but the general strategy is: open the calendar, navigate month/year, then click the correct day.

```java
public void selectDate(WebDriver driver, String targetMonthYear, String targetDay) {
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

    // 1. Open the calendar widget
    driver.findElement(By.id("datepicker-input")).click();

    // 2. Navigate to the correct month/year by clicking "Next" until match
    while (true) {
        WebElement header = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.className("ui-datepicker-title")));
        if (header.getText().trim().equalsIgnoreCase(targetMonthYear)) {
            break;
        }
        driver.findElement(By.className("ui-datepicker-next")).click();
    }

    // 3. Select the target day from the visible calendar grid
    List<WebElement> days = driver.findElements(By.cssSelector(".ui-datepicker-calendar td a"));
    for (WebElement day : days) {
        if (day.getText().equals(targetDay)) {
            day.click();
            break;
        }
    }
}
```

**For a native HTML5 `<input type="date">`:**

```java
// Simplest approach — send keys directly in the browser's expected format
WebElement dateInput = driver.findElement(By.cssSelector("input[type='date']"));
dateInput.sendKeys("08/20/2026"); // format depends on browser locale (MM/dd/yyyy for Chrome)

// Or set via JavaScript when sendKeys is unreliable across browsers
JavascriptExecutor js = (JavascriptExecutor) driver;
js.executeScript("arguments[0].value='2026-08-20';", dateInput);
```

**Key points:**
- Always identify whether it's a native `<input type="date">`, a JS widget, or a custom dropdown-based calendar first
- Prefer looping with an `ExpectedCondition` check over hard-coded click counts for month navigation
- `JavascriptExecutor` is a reliable fallback when native `sendKeys()` behaves inconsistently across browsers

---

### 11. How do you fetch text from a text box in Selenium?

For a normal element (like a `<div>`, `<span>`, or `<label>`), `getText()` works. But for an `<input>`/`<textarea>` text box, the value lives in the **`value` attribute**, not the visible text — `getText()` returns an empty string for input fields.

```java
WebElement textBox = driver.findElement(By.id("username"));

// Correct way to fetch the entered/pre-filled value from an <input>
String enteredValue = textBox.getAttribute("value");
System.out.println("Text box value: " + enteredValue);

// getText() would return "" for <input> elements — only works for visible inner text
String label = driver.findElement(By.tagName("label")).getText();
```

**Key point:** `getText()` reads the rendered inner text of an element (e.g., `<div>`, `<p>`); `getAttribute("value")` reads the current value of form controls like `<input>` and `<textarea>`.

---

### 12. How do you enter text into an alert using Selenium?

This applies to a **JavaScript prompt alert** (`window.prompt()`), which accepts text input.

```java
// Trigger the action that opens the alert/prompt
driver.findElement(By.id("prompt-btn")).click();

// Switch control to the alert
Alert alert = driver.switchTo().alert();

// Enter text into the prompt's input box
alert.sendKeys("Sriram Kukkadapu");

// Accept (OK) or dismiss (Cancel)
alert.accept();
// alert.dismiss();
```

**Note:** `sendKeys()` on an `Alert` only works for **prompt** dialogs (which have a text field). A plain `alert()` or `confirm()` dialog has no input field, so calling `sendKeys()` on those throws an exception.

---

### 13. Difference between checked and unchecked exceptions

| Aspect | Checked Exception | Unchecked Exception |
|--------|--------------------|-----------------------|
| Compile-time check | Compiler forces you to handle (try-catch or `throws`) | Compiler does NOT force handling |
| Parent class | `Exception` (excluding `RuntimeException`) | `RuntimeException` and its subclasses |
| When it occurs | Anticipated, recoverable conditions | Programming errors, usually avoidable |
| Examples | `IOException`, `SQLException` | `NullPointerException`, `ArrayIndexOutOfBoundsException`, `NoSuchElementException` |

```java
// Checked exception — must handle or declare
public void readConfigFile() throws IOException {
    FileReader reader = new FileReader("config.properties");
}

// Unchecked exception — compiler doesn't force handling
public void clickElement(WebDriver driver) {
    driver.findElement(By.id("missing-id")).click(); // throws NoSuchElementException at runtime
}
```

**In Selenium:** Most Selenium exceptions (`NoSuchElementException`, `TimeoutException`, `StaleElementReferenceException`, `ElementClickInterceptedException`) are **unchecked** — they extend `RuntimeException`, so you're not forced to catch them, though good frameworks catch and log them meaningfully.

---

### 14. If XPath selects two elements, does findElement() throw an exception?

**No, it does not throw an exception.** `findElement()` (singular) simply returns the **first matching element** in the DOM order when the locator matches multiple elements — it does not throw `NoSuchElementException` or any "multiple elements found" error.

```java
// If this XPath matches 2 elements, findElement() silently returns the FIRST one
WebElement el = driver.findElement(By.xpath("//button[@class='btn']"));
el.click(); // Clicks the first matching button, second one is ignored — potential test bug!
```

**Why this matters:** This is a common source of **flaky/incorrect test behavior** — if your locator isn't specific enough and matches multiple elements, `findElement()` won't warn you; it'll just silently interact with the wrong element. The fix is to make the locator more specific, or use `findElements()` and explicitly pick the correct index/element by additional criteria.

```java
// Safer — inspect how many matched, then decide
List<WebElement> matches = driver.findElements(By.xpath("//button[@class='btn']"));
System.out.println("Matched: " + matches.size());
WebElement correctOne = matches.get(1); // explicit choice, not silent
```

`NoSuchElementException` is thrown **only when zero elements match**, never when there are duplicates.

---

### 15. Explain smoke testing and sanity testing

| Aspect | Smoke Testing | Sanity Testing |
|--------|-----------------|------------------|
| Purpose | Verify build stability — "is it even worth testing further?" | Verify a specific bug fix/feature works after a minor change |
| Scope | Broad but shallow — covers critical/core flows | Narrow and deep — focused on the specific area changed |
| When performed | Right after a new build/deployment | After minor code changes or bug fixes, before full regression |
| Scripted or not | Usually scripted/automated (part of CI pipeline) | Usually unscripted/exploratory |
| Example | Login, navigation, and checkout all load without crashing | Verify the "forgot password" fix actually sends the reset email |

**In automation context:** I typically maintain a `@Smoke` TestNG group that runs the critical-path tests (login, core navigation, checkout) automatically after every deployment via Jenkins, so we catch a broken build within minutes.

```java
@Test(groups = {"smoke"})
public void verifyLoginPageLoads() {
    driver.get(baseUrl);
    Assert.assertTrue(driver.findElement(By.id("login-form")).isDisplayed());
}
```

```xml
<!-- testng.xml -->
<test name="SmokeSuite">
    <groups>
        <run>
            <include name="smoke"/>
        </run>
    </groups>
    <classes>
        <class name="tests.LoginTest"/>
    </classes>
</test>
```

---

### 16. What are relative locators in Selenium?

Relative locators (introduced in Selenium 4) let you locate an element **relative to another element's position** on the page — above, below, toLeftOf, toRightOf, or near — without needing a complex XPath.

```java
import static org.openqa.selenium.support.locators.RelativeLocator.with;

// Find the input field that is BELOW the "Email" label
WebElement emailLabel = driver.findElement(By.xpath("//label[text()='Email']"));
WebElement emailInput = driver.findElement(with(By.tagName("input")).below(emailLabel));

// toRightOf — find the button to the right of a given element
WebElement cancelBtn = driver.findElement(By.id("cancel"));
WebElement okBtn = driver.findElement(with(By.tagName("button")).toRightOf(cancelBtn));

// near — find an element within ~50px of another
WebElement icon = driver.findElement(By.id("search-icon"));
WebElement searchBox = driver.findElement(with(By.tagName("input")).near(icon));

// Combine multiple conditions
WebElement passwordField = driver.findElement(
    with(By.tagName("input")).below(emailInput).above(By.id("submit")));
```

**Available relative locator methods:** `above()`, `below()`, `toLeftOf()`, `toRightOf()`, `near()`.

**Use case:** Extremely useful for forms with repeated/generic elements (e.g., multiple `<input>` fields) where the only reliable way to distinguish them is their visual position relative to a label or another anchor element.

---

### 17. Explain challenges faced in your project

**Sample Answer (structure — adapt with real project details):**

> "One major challenge was **flaky tests** caused by a React-based SPA where elements re-rendered asynchronously. Simple `Thread.sleep()` calls made tests slow and still unreliable. I resolved this by replacing all hard waits with `WebDriverWait` + `ExpectedConditions`, and introduced a custom `FluentWait` for a few components that had unpredictable load times due to third-party widgets.
>
> Another challenge was **test data collisions** in parallel execution — multiple threads were creating orders with the same test user, causing conflicts. I fixed this by generating unique test data per thread using `ThreadLocal` combined with timestamps, and moved data setup to API calls instead of the UI to make it faster and safer.
>
> A third challenge was **maintaining locators** as the dev team frequently changed CSS classes during a UI redesign. I pushed for `data-testid` attributes to be added by developers, which decoupled our locators from styling changes and drastically cut down locator maintenance."

**Tips:**
- Always structure as: **Problem → Root cause → Solution → Result/impact**
- Pick a challenge that shows technical depth (flakiness, parallelization, framework design) — not just "communication issues"

---

### 18. How would you select test cases for regression testing?

**Criteria I use to build a regression suite:**

1. **Core/critical business flows** — login, checkout, payment, search (highest priority)
2. **Areas impacted by recent changes** — tie regression scope to the change log/JIRA tickets for that release
3. **High defect-density modules** — areas that historically produce the most bugs
4. **Frequently used features** — based on production usage analytics
5. **Integration points** — modules that touch multiple systems (payment gateway, third-party APIs)
6. **Previously reported production bugs** — always add a regression test for any bug that escaped to production
7. **Cross-browser/cross-device critical paths** — at minimum for the top 2-3 browsers

**Practical approach:**

```java
@Test(groups = {"regression", "checkout"}, priority = 1)
public void verifyCheckoutFlow() { /* ... */ }

@Test(groups = {"regression", "login"}, priority = 2)
public void verifyLoginWithValidCredentials() { /* ... */ }
```

I tag tests using TestNG groups (`regression`, `smoke`, `sanity`) so we can selectively run subsets based on the release scope — a full regression before major releases, and a scoped/impacted-area regression for hotfixes.

---

## Round 2: Techno-Managerial

### 1. Explain your automation framework in detail

**Sample Answer:**

"My framework is built on **Selenium WebDriver + Java + TestNG + Maven**, following the **Page Object Model** with a hybrid data-driven and keyword-driven approach.

**Structure:**

```
Framework/
├── src/main/java/
│   ├── pages/           # Page Object classes (locators + actions)
│   ├── base/            # BaseTest — driver init/teardown, WebDriverManager setup
│   ├── utils/           # ExcelUtils, PropertyUtils, ScreenshotUtils, WaitUtils
│   ├── listeners/       # TestNG ITestListener for reporting/screenshots
│   └── factory/         # DriverFactory (Chrome/Firefox/Edge via config)
├── src/test/java/
│   ├── tests/           # Test classes calling Page Objects
│   └── stepdefinitions/ # Cucumber step definitions (if BDD)
├── src/test/resources/
│   ├── testdata/        # Excel/JSON/properties test data
│   └── features/        # Gherkin feature files
├── testng.xml           # Suite configuration, parallel execution, groups
├── pom.xml               # Maven dependencies + Surefire/plugin config
└── reports/              # Extent Reports / Allure output
```

**Key design decisions:**
- **DriverFactory** with `ThreadLocal<WebDriver>` to support parallel execution safely
- **BasePage** class with common reusable methods (`waitAndClick`, `waitAndType`, `getText`) that all Page Objects extend
- **Explicit waits only** — no `Thread.sleep()` anywhere in the codebase
- **Data-driven** using Excel (Apache POI) or JSON, decoupled from test logic
- **TestNG listeners** for auto screenshot-on-failure and Extent Report generation
- **CI/CD integration** — Jenkins pipeline triggers Maven `mvn test` with parameterized environment/browser, publishes Extent/Allure reports
- **Cross-browser support** via config-driven `DriverFactory` (Chrome, Firefox, Edge)

This framework currently covers 300+ test cases across smoke, sanity, and regression suites, integrated into our CI pipeline with parallel execution reducing full regression time from ~3 hours to ~45 minutes."

---

### 2. If you have 100 pages, would you create 100 Page Objects?

**Answer: Not necessarily — it depends on component reuse, not strictly one-to-one with pages.**

- If 100 pages genuinely have distinct, unrelated UI elements, then yes, 100 Page Object classes is reasonable and maintainable.
- However, many pages share **common components** (header, footer, navigation menu, search bar, filters) — these should be extracted into their own reusable component classes rather than duplicated across all 100 Page Objects.
- For pages that are structurally identical but differ only in data (e.g., 50 near-identical "product detail" pages), **one generic Page Object parameterized by data** is far more maintainable than 50 separate classes.

```java
// Shared component — reused across many Page Objects via composition
public class HeaderComponent {
    private WebDriver driver;
    private By searchBox = By.id("search");

    public HeaderComponent(WebDriver driver) { this.driver = driver; }
    public void search(String term) {
        driver.findElement(searchBox).sendKeys(term);
    }
}

public class HomePage {
    WebDriver driver;
    HeaderComponent header; // composition, not duplication

    public HomePage(WebDriver driver) {
        this.driver = driver;
        this.header = new HeaderComponent(driver);
    }
}
```

**Practical guideline:** Model Page Objects around **distinct screens/components with meaningfully different behavior**, not a rigid 1:1 mapping to every page in the app. Favor composition (shared components) over duplicating locators across near-identical pages.

---

### 3. What is an "Element Click Intercepted" exception and how do you fix it?

**`ElementClickInterceptedException`** occurs when Selenium tries to click an element, but **another element is overlapping it** (e.g., a modal, sticky header, loading spinner, or ad banner is on top), so the click is intercepted by that other element instead.

**Common causes:**
- A modal/overlay/spinner still visible on top of the target element
- Sticky header/footer covering the element
- Element not yet fully scrolled into view
- Animation still in progress when the click fires

**Fixes:**

```java
// 1. Wait for the element to be CLICKABLE (not just visible/present)
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(By.id("submit")));
btn.click();

// 2. Scroll the element into view before clicking
JavascriptExecutor js = (JavascriptExecutor) driver;
js.executeScript("arguments[0].scrollIntoView({block:'center'});", btn);
btn.click();

// 3. Wait for the intercepting overlay/spinner to disappear
wait.until(ExpectedConditions.invisibilityOfElementLocated(By.className("loading-spinner")));
btn.click();

// 4. Fallback — click via JavaScript (bypasses interception, use sparingly)
js.executeScript("arguments[0].click();", btn);

// 5. Using Actions class to move to element first, then click
new Actions(driver).moveToElement(btn).click().perform();
```

**Best practice order:** First try `elementToBeClickable` + waiting for the overlay to disappear (real fix). Use JS click only as a last resort, since it bypasses actionability checks and can mask real UI bugs.

---

### 4. How do you take screenshots only for failed TestNG test cases?

Using a custom **`ITestListener`** implementation, hooking into the `onTestFailure()` callback.

```java
public class ScreenshotListener implements ITestListener {

    @Override
    public void onTestFailure(ITestResult result) {
        WebDriver driver = DriverFactory.getDriver(); // fetch current thread's driver
        if (driver != null) {
            TakesScreenshot ts = (TakesScreenshot) driver;
            File source = ts.getScreenshotAs(OutputType.FILE);
            String screenshotPath = "screenshots/" + result.getName() + "_" + System.currentTimeMillis() + ".png";
            try {
                FileUtils.copyFile(source, new File(screenshotPath));
                // Attach to Extent Report / TestNG reporter
                Reporter.log("<a href='" + screenshotPath + "'>Screenshot</a>");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

**Register the listener:**

```java
// Option 1 — annotation on the test class
@Listeners(ScreenshotListener.class)
public class LoginTest { /* ... */ }
```

```xml
<!-- Option 2 — testng.xml -->
<suite name="Suite">
    <listeners>
        <listener class-name="listeners.ScreenshotListener"/>
    </listeners>
    <test name="Test">
        <classes>
            <class name="tests.LoginTest"/>
        </classes>
    </test>
</suite>
```

**Key point:** `onTestFailure()` fires **only** when an assertion fails or an exception propagates up from the `@Test` method — so screenshots are captured exclusively for failures, keeping the reports/disk usage clean.

---

### 5. How do you connect your test cases with Azure?

This typically refers to integrating automation with **Azure DevOps** (Test Plans + Pipelines) for test execution and result publishing.

**Approach:**

1. **CI/CD via Azure Pipelines** — configure `azure-pipelines.yml` to run Maven/TestNG tests as part of the build pipeline:

```yaml
trigger:
  - main

pool:
  vmImage: 'windows-latest'

steps:
  - task: Maven@3
    inputs:
      mavenPomFile: 'pom.xml'
      goals: 'test'
      options: '-DsuiteXmlFile=testng.xml'

  - task: PublishTestResults@2
    inputs:
      testResultsFormat: 'JUnit'
      testResultsFiles: '**/surefire-reports/*.xml'
```

2. **Linking automated tests to Azure Test Plans** — using the **Test & Feedback extension** or annotating tests with the corresponding Test Case ID so results map back to Azure Test Plans:

```java
// Custom annotation mapping automated test to Azure Test Case ID
@AzureTestCase(id = "12345")
@Test
public void verifyLoginFunctionality() { /* ... */ }
```

3. **Publishing results** — Surefire generates JUnit-format XML reports, which `PublishTestResults@2` task consumes and displays directly in the Azure DevOps "Tests" tab, linked against the corresponding Test Plan.

4. **Work item integration** — failed tests automatically create/link bugs to the associated Azure Boards work item using the REST API.

**Key point:** The real integration work is (a) getting Maven/TestNG output into JUnit XML format, and (b) wiring the pipeline task to publish and map results back to Azure Test Plans/Boards.

---

### 6. What is the Git fetch command?

`git fetch` downloads commits, files, and refs from a remote repository into your local repo's **remote-tracking branches** (e.g., `origin/main`) — **without merging** them into your current working branch.

```bash
git fetch origin          # Fetch all branches from 'origin'
git fetch origin main     # Fetch only the 'main' branch

# See what changed after fetching, before merging
git log HEAD..origin/main --oneline

# Merge manually after reviewing
git merge origin/main
```

**`git fetch` vs `git pull`:**

| Command | Behavior |
|---------|----------|
| `git fetch` | Downloads changes only — your working branch is untouched |
| `git pull` | `git fetch` + `git merge` (or rebase) — automatically integrates changes |

**Why it matters in a QA/automation context:** `git fetch` lets you safely review incoming changes to a shared automation framework repo (e.g., check what teammates pushed to `main`) before merging into your feature branch, reducing the risk of unexpected conflicts or breaking changes.

---

### 7. In Postman, how do you delete a variable after test execution?

Using the **Tests tab** (or the Post-response script) with the Postman scripting API (`pm`):

```javascript
// Delete a variable from the environment
pm.environment.unset("authToken");

// Delete a variable from collection scope
pm.collectionVariables.unset("orderId");

// Delete a global variable
pm.globals.unset("sessionId");

// Clear ALL environment variables (use with caution)
pm.environment.clear();
```

**Typical use case:** Setting a token/ID as a variable during test setup (e.g., an auth token captured from a login request), using it across subsequent requests in the collection, then calling `pm.environment.unset()` in the last request's Tests tab to clean up so it doesn't leak into unrelated test runs or get reused stale in the next execution.

```javascript
// Example: capture token, use across requests, clean up at the end
pm.test("Save auth token", function () {
    var jsonData = pm.response.json();
    pm.environment.set("authToken", jsonData.token);
});

// ... later, in the final request of the collection ...
pm.test("Cleanup", function () {
    pm.environment.unset("authToken");
});
```

---

### 8. Why do you prefer Cucumber BDD?

**Reasons to prefer Cucumber BDD in a Selenium framework:**

1. **Business-readable specifications** — Feature files in Gherkin (`Given/When/Then`) are understandable by BAs, Product Owners, and non-technical stakeholders, enabling true collaboration on requirements.
2. **Living documentation** — Feature files double as up-to-date documentation of expected system behavior.
3. **Reusability of steps** — Step definitions can be reused across multiple scenarios/features, reducing duplication.
4. **Clear separation of concerns** — Business logic (feature file) is decoupled from technical implementation (step definitions + Page Objects).
5. **Better collaboration (Three Amigos)** — Encourages developers, testers, and business analysts to agree on behavior before development starts.
6. **Data-driven scenarios via Scenario Outline** — easy parameterization with `Examples` tables.

```gherkin
Feature: Login functionality

  Scenario Outline: Login with valid and invalid credentials
    Given user navigates to the login page
    When user enters username "<username>" and password "<password>"
    And clicks the login button
    Then the result should be "<result>"

    Examples:
      | username | password  | result  |
      | admin    | Test1234  | Success |
      | admin    | wrongpass | Failure |
```

```java
public class LoginSteps {
    WebDriver driver = DriverFactory.getDriver();
    LoginPage loginPage = new LoginPage(driver);

    @Given("user navigates to the login page")
    public void navigateToLoginPage() {
        driver.get("https://example.com/login");
    }

    @When("user enters username {string} and password {string}")
    public void enterCredentials(String username, String password) {
        loginPage.login(username, password);
    }

    @Then("the result should be {string}")
    public void verifyResult(String expectedResult) {
        Assert.assertEquals(loginPage.getResultMessage(), expectedResult);
    }
}
```

**When I'd NOT recommend it:** For a purely technical API-testing suite with no business stakeholder involvement, plain TestNG/JUnit is often leaner — Cucumber adds overhead (feature files + step definitions + glue code) that isn't justified without a genuine need for business-readable specs.

---

### 9. Explain dynamic binding and static binding

| Aspect | Static Binding | Dynamic Binding |
|--------|-----------------|-------------------|
| Resolved at | Compile time | Runtime |
| Applies to | Overloaded methods, static/private/final methods, variables | Overridden methods (polymorphism) |
| Mechanism | Based on reference type | Based on actual object type |
| Also known as | Early binding | Late binding |

```java
class Page {
    // Static binding — method overloading resolved at compile time
    public void load() { System.out.println("Loading page"); }
    public void load(int timeout) { System.out.println("Loading page with timeout: " + timeout); }
}

class BasePage {
    public void click() { System.out.println("Base click"); }
}

class LoginPage extends BasePage {
    @Override
    public void click() { System.out.println("Login page click"); } // Dynamic binding target
}

public class BindingDemo {
    public static void main(String[] args) {
        // STATIC BINDING — compiler decides which overload to call based on argument types
        Page page = new Page();
        page.load();      // "Loading page"
        page.load(5000);  // "Loading page with timeout: 5000"

        // DYNAMIC BINDING — JVM decides at runtime based on actual object, not reference type
        BasePage basePage = new LoginPage(); // reference type BasePage, actual object LoginPage
        basePage.click(); // "Login page click" — resolved at RUNTIME via method overriding
    }
}
```

**Why this matters in Selenium frameworks:** Page Object hierarchies often use inheritance (e.g., a `BasePage` with common methods overridden by specific pages). Understanding dynamic binding explains why calling an overridden method through a `BasePage` reference still correctly invokes the subclass's implementation.

---

### 10. Difference between method overloading and method overriding

| Aspect | Method Overloading | Method Overriding |
|--------|----------------------|----------------------|
| Definition | Same method name, different parameter list, same class | Same method signature, subclass redefines parent's method |
| Binding | Static (compile-time) | Dynamic (runtime) |
| Inheritance required | No | Yes |
| Return type | Can differ | Must be same or covariant |
| Access modifier | Can differ freely | Cannot be more restrictive than parent |
| Purpose | Compile-time polymorphism | Runtime polymorphism |

```java
// OVERLOADING — same class, different parameters
class WaitUtils {
    public void waitFor(WebElement element) {
        new WebDriverWait(driver, Duration.ofSeconds(10)).until(ExpectedConditions.visibilityOf(element));
    }
    public void waitFor(WebElement element, int seconds) {
        new WebDriverWait(driver, Duration.ofSeconds(seconds)).until(ExpectedConditions.visibilityOf(element));
    }
}

// OVERRIDING — subclass redefines parent behavior
class BasePage {
    public void waitForPageLoad() {
        System.out.println("Generic page load wait");
    }
}
class DashboardPage extends BasePage {
    @Override
    public void waitForPageLoad() {
        System.out.println("Waiting for dashboard widgets to load");
    }
}
```

---

### 11. Difference between Comparable and Comparator

| Aspect | `Comparable` | `Comparator` |
|--------|--------------|--------------|
| Package | `java.lang` | `java.util` |
| Method | `compareTo(T o)` | `compare(T o1, T o2)` |
| Where implemented | Inside the class itself | In a separate class (or lambda) |
| Number of sort sequences | Only one natural ordering | Multiple custom orderings possible |
| Modifies original class | Yes — class must implement it | No — external, doesn't touch the class |

```java
class TestResult implements Comparable<TestResult> {
    String testName;
    long executionTimeMs;

    TestResult(String name, long time) { this.testName = name; this.executionTimeMs = time; }

    // Comparable — defines the DEFAULT/natural sort order
    @Override
    public int compareTo(TestResult other) {
        return Long.compare(this.executionTimeMs, other.executionTimeMs);
    }
}

// Comparator — defines an ALTERNATE sort order, without touching TestResult class
Comparator<TestResult> byNameComparator = (t1, t2) -> t1.testName.compareTo(t2.testName);

List<TestResult> results = new ArrayList<>();
results.add(new TestResult("LoginTest", 1200));
results.add(new TestResult("CheckoutTest", 3400));

Collections.sort(results); // uses compareTo() — natural order (by execution time)
Collections.sort(results, byNameComparator); // uses Comparator — alphabetical by name

// Modern lambda-based Comparator, e.g. sorting WebElements or test data
results.sort(Comparator.comparing(r -> r.testName));
results.sort(Comparator.comparingLong((TestResult r) -> r.executionTimeMs).reversed());
```

**When to use which:** Use `Comparable` when there's one obvious natural ordering for the class. Use `Comparator` when you need multiple, flexible, or ad-hoc sort orders (e.g., sort test results by time in one report and by name in another) without modifying the original class.

---

### 12. How would you determine whether a login page is user-friendly?

**Usability checklist I'd apply (functional + UX heuristics):**

1. **Clear labeling** — Username/email and password fields are clearly labeled, with visible placeholders
2. **Validation feedback** — Real-time, clear error messages for invalid input (not just generic "Error occurred")
3. **Accessibility** — Proper tab order, keyboard navigation, ARIA labels for screen readers, sufficient color contrast
4. **Password visibility toggle** — "Show/Hide password" option
5. **Forgot password / Sign up links** — Easily discoverable, not buried
6. **Responsive design** — Works cleanly across desktop, tablet, mobile viewports
7. **Loading/feedback state** — Button shows a spinner/disabled state while login is processing (prevents double submission)
8. **Error message specificity** — Distinguishes between "invalid username" and "invalid password" where security allows, or gives helpful generic guidance
9. **Field-level focus handling** — Cursor auto-focuses the first field on page load
10. **Session/security cues** — "Remember me" option, CAPTCHA only when needed (not on every attempt), lockout messaging after repeated failures

**How I'd validate some of these with automation:**

```java
// Verify tab order / accessibility attributes
WebElement username = driver.findElement(By.id("username"));
Assert.assertEquals(username.getAttribute("tabindex"), "1");

// Verify inline validation appears without full page reload
driver.findElement(By.id("password")).sendKeys("123");
driver.findElement(By.id("username")).click(); // trigger blur
WebElement error = wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("field-error")));
Assert.assertTrue(error.getText().contains("Password must be at least"));
```

I'd combine this automated verification with a manual **heuristic evaluation** (Nielsen's usability heuristics) since "user-friendliness" also has subjective/visual aspects that automation can't fully capture.

---

### 13. What are 5 points you consider when writing a good test case?

1. **Clear preconditions and test data** — State exactly what setup/state is required before the steps begin (e.g., "user must be logged in as Admin")
2. **Precise, unambiguous steps** — Each step should have exactly one expected action, written so anyone (not just the author) can execute it identically
3. **Single, verifiable expected result** — Every step (or the overall case) must have a clear, measurable pass/fail expected outcome — not "should work correctly"
4. **Traceability to requirements** — Link the test case to a requirement/user story/JIRA ticket ID so coverage can be tracked
5. **Independence and repeatability** — The test case should not depend on another test case's leftover state, and should produce the same result every time it's run

**Additional practical points I also apply:**
- Cover both **positive and negative** scenarios (valid input + invalid/edge cases)
- Keep test cases **atomic** — one test case verifies one specific behavior, not five things at once
- Include **priority/severity** so execution can be triaged under time pressure

```gherkin
Test Case ID: TC_LOGIN_002
Title: Verify login fails with incorrect password
Precondition: User "testuser@example.com" exists and is active
Test Data: username="testuser@example.com", password="wrongpass123"
Steps:
  1. Navigate to login page
  2. Enter username and incorrect password
  3. Click Login button
Expected Result: Error message "Invalid username or password" is displayed; user remains on login page
Priority: High
Linked Requirement: JIRA-4521
```

---

### 14. If a developer is not fixing a bug, how would you handle the situation?

**Structured escalation approach:**

1. **Re-verify and clarify first** — Confirm the bug is reproducible with clear steps, screenshots/logs, and severity/priority correctly set. Sometimes "not fixing" actually means "not understood" or "not reproducible on their end."
2. **Direct conversation** — Have a 1:1 conversation with the developer to understand *why* — is it deprioritized, disputed as "not a bug," blocked by another dependency, or simply overlooked?
3. **Provide additional evidence** — If they dispute it's a bug, provide business/requirement justification (linked user story, expected behavior documentation), logs, or a short screen recording.
4. **Involve the right stakeholders** — If it's a genuine priority disagreement, involve the Scrum Master/Team Lead/Product Owner to re-assess priority/severity in the backlog, rather than escalating it as a conflict.
5. **Document objectively** — Keep the discussion and decision documented in the bug tracker (e.g., JIRA comments) so there's a clear audit trail of why it was or wasn't fixed, and by when.
6. **Track and follow up** — If deprioritized, note the target release/sprint and follow up before that release closes to ensure it isn't silently dropped.

**Sample answer:**

> "I first make sure I've given the developer everything they need — clear reproduction steps, environment details, logs, and severity justification. If they still push back, I have a direct conversation to understand their reasoning rather than assuming it's negligence — sometimes there's a valid technical constraint or a difference in understanding of expected behavior. If we genuinely disagree on priority, I loop in the Product Owner or Scrum Master to make the call, since prioritization is a team decision, not something to resolve through conflict. Throughout, I keep everything documented in the tracker so the decision and reasoning are visible to the whole team."

---

### 15. What are threads in JMeter?

In JMeter, a **Thread** represents a **single virtual user** executing the test plan. The **Thread Group** is the JMeter element that controls how many virtual users (threads) are simulated, how quickly they ramp up, and how many times they loop.

**Key Thread Group properties:**

| Property | Meaning |
|----------|---------|
| **Number of Threads (users)** | How many concurrent virtual users to simulate |
| **Ramp-up period** | Time (seconds) over which all threads start — e.g., 100 threads over 10s ramp-up means 10 new users start every second |
| **Loop Count** | How many times each thread repeats the test plan |

```
Thread Group
├── Number of Threads: 100        (simulate 100 concurrent users)
├── Ramp-up period: 10 seconds    (all 100 users start within 10s)
├── Loop Count: 5                 (each user repeats the flow 5 times)
└── Samplers (HTTP Requests, etc.)
```

**Why ramp-up matters:** If you set 100 threads with a 0-second ramp-up, all 100 users hit the server **simultaneously**, which can simulate a spike/stress scenario. A longer ramp-up (e.g., 100s) simulates a more gradual, realistic load increase.

**Total requests calculation:** `Number of Threads × Loop Count × number of samplers per loop`. E.g., 100 threads × 5 loops × 1 HTTP request = 500 total requests.

**Types of Thread Groups in JMeter:**
- **Standard Thread Group** — basic configuration as above
- **Stepping Thread Group** — gradually increases load in defined steps (plugin)
- **Ultimate Thread Group** — fine-grained control over multiple load phases (plugin)

---

### 16. Can you automate CAPTCHAs?

**Short answer: You generally should NOT and typically CANNOT reliably automate solving a real CAPTCHA** — that's precisely its purpose: to distinguish humans from bots.

**Why it's problematic:**
- Attempting to programmatically bypass/solve a production CAPTCHA (via OCR, third-party solving services, etc.) is against the terms of service of most CAPTCHA providers and the application under test, and can be considered abuse.
- Even if technically "solvable," it introduces flakiness (CAPTCHAs are intentionally designed to resist automated pattern recognition and OCR).

**Realistic, legitimate approaches used in real projects:**

1. **Disable CAPTCHA in the test/QA environment** — the most common and correct approach. Ask developers to add a feature flag or environment-based config that disables CAPTCHA validation in non-production environments.
   ```java
   // Backend exposes a bypass only in QA/test environments
   if (environment.equals("QA") || environment.equals("TEST")) {
       skipCaptchaValidation();
   }
   ```
2. **Whitelist a test bypass token** — some CAPTCHA providers (e.g., Google reCAPTCHA) offer official test site keys that always return a fixed, predictable success/failure token for automated testing.
3. **Mock/stub the CAPTCHA verification API call** at the network level so the backend always treats it as validated, without touching the actual CAPTCHA widget in the UI.
4. **Test CAPTCHA presence, not CAPTCHA-solving** — for the production/staging environment where CAPTCHA can't be disabled, limit automated coverage to verifying the CAPTCHA widget renders correctly, and leave the actual "solve and submit" flow to manual/exploratory testing.

**In an interview, the correct framing is:** raise it as an environment/config concern to be solved collaboratively with developers (disable in test envs), not as something to defeat programmatically.

---

### 17. When would you use Fluent Wait?

`FluentWait` is used when you need **more control** than a standard `WebDriverWait` provides — specifically, custom **polling frequency** and the ability to **ignore specific exceptions** while waiting.

**When to use it:**
- When an element's presence is **unpredictable in timing** (e.g., appears anywhere between 2 and 30 seconds depending on backend load)
- When you want to **ignore `NoSuchElementException` or `StaleElementReferenceException`** during the polling loop, instead of failing immediately
- When you need a **custom polling interval** (e.g., check every 2 seconds instead of the default ~500ms) to reduce unnecessary DOM queries on a heavy page

```java
Wait<WebDriver> fluentWait = new FluentWait<>(driver)
        .withTimeout(Duration.ofSeconds(30))
        .pollingEvery(Duration.ofSeconds(2))
        .ignoring(NoSuchElementException.class)
        .ignoring(StaleElementReferenceException.class);

WebElement dynamicElement = fluentWait.until(driver1 ->
        driver1.findElement(By.id("dynamic-widget")));
dynamicElement.click();
```

**`WebDriverWait` vs `FluentWait`:**

| Aspect | `WebDriverWait` | `FluentWait` |
|--------|------------------|---------------|
| Polling interval | Fixed default (~500ms) | Configurable |
| Exceptions ignored | `NoSuchElementException` by default only | Any exception(s) you specify |
| Use case | Standard scenarios | Unpredictable timing / flaky third-party widgets |

**Practical example:** I used `FluentWait` for a third-party payment widget embedded via iframe that loaded anywhere between 3-25 seconds depending on the payment gateway's response time — a standard `WebDriverWait` with default polling wasted CPU cycles re-querying every 500ms, whereas `FluentWait` with a 2-second poll interval and ignored `StaleElementReferenceException` handled it reliably.

---

### 18. How would you open a new tab in Selenium?

Selenium 4 uses the standard `WindowType` enum with `switchTo().newWindow()` for a clean, built-in way to open new tabs/windows.

```java
// Open a new TAB (Selenium 4+)
driver.switchTo().newWindow(WindowType.TAB);
driver.get("https://example.com");

// Open a new WINDOW (separate browser window, not a tab)
driver.switchTo().newWindow(WindowType.WINDOW);
driver.get("https://example.com");

// Switch back to the original tab/window
Set<String> windowHandles = driver.getWindowHandles();
String originalWindow = driver.getWindowHandle();

for (String handle : windowHandles) {
    driver.switchTo().window(handle);
}

// Switch back to the first opened window explicitly
driver.switchTo().window(originalWindow);
```

**Handling a new tab opened by clicking a link (pre-Selenium 4 style, still commonly used):**

```java
String originalWindow = driver.getWindowHandle();
driver.findElement(By.linkText("Open in new tab")).click();

// Wait until a new window handle appears
new WebDriverWait(driver, Duration.ofSeconds(10))
    .until(d -> d.getWindowHandles().size() > 1);

for (String handle : driver.getWindowHandles()) {
    if (!handle.equals(originalWindow)) {
        driver.switchTo().window(handle);
        break;
    }
}
// Now interact with the new tab
System.out.println(driver.getTitle());

// Close new tab and return to original
driver.close();
driver.switchTo().window(originalWindow);
```

**Key points:**
- `driver.getWindowHandles()` returns a `Set<String>` of all open tab/window handles
- Always capture the original handle before opening a new tab, so you can switch back reliably
- `driver.close()` closes only the current tab; `driver.quit()` closes the entire browser session

---

### 19. What is the purpose of a CRON expression in Jenkins?

A **CRON expression** in Jenkins is used to **schedule when a job/pipeline should run automatically** — e.g., nightly regression runs, hourly smoke tests — without manual triggering.

**Jenkins CRON syntax:** `MINUTE HOUR DOM MONTH DOW` (5 fields, similar to Unix cron but with some Jenkins-specific extensions).

```
* * * * *
| | | | |
| | | | └── Day of week (0-7, both 0 and 7 = Sunday)
| | | └──── Month (1-12)
| | └────── Day of month (1-31)
| └──────── Hour (0-23)
└────────── Minute (0-59)
```

**Common examples:**

```
H 2 * * *         → Run once daily, sometime around 2 AM (H = hash, spreads load across servers)
H/15 * * * *      → Run every ~15 minutes
0 9 * * 1-5       → Run at 9:00 AM, Monday through Friday
H 22 * * 1        → Run around 10 PM every Monday
0 0 1 * *         → Run at midnight on the 1st of every month
```

**Why Jenkins recommends `H` instead of a fixed number:** `H` (hash) spreads scheduled job start times based on a hash of the job name, preventing all scheduled jobs from firing at the exact same instant (e.g., all jobs hitting `0 0 * * *` simultaneously would overload the Jenkins master/agents at midnight).

**Where it's configured:** Job configuration → **Build Triggers** → **Build periodically** (or **Poll SCM**, which uses the same cron syntax to check for repo changes on a schedule).

**Practical use in a QA automation context:**
- Schedule the **full regression suite** to run nightly (`H 1 * * *`) so results are ready each morning
- Schedule a **smoke suite** to run every few hours against a shared QA environment to catch environment-breaking issues quickly
- Combine with **Poll SCM** (`H/5 * * * *`) to trigger a build automatically shortly after new commits are pushed

---

*Good luck with your interview preparation!*

---

## 2. Coforge — QA Automation Interview Questions

*Attended in May 2026. Round 1 was majorly focused on Selenium + Java concepts.*

---

### 1. Explain your Automation Framework?

**Sample Answer:**

"My framework is built on **Selenium WebDriver + Java + TestNG + Maven**, following the **Page Object Model**.

**Structure:**

```
Framework/
├── src/main/java/
│   ├── pages/           # Page Object classes (locators + actions)
│   ├── base/            # BaseTest — driver init/teardown
│   ├── utils/           # ExcelUtils, PropertyUtils, ScreenshotUtils, WaitUtils
│   ├── listeners/       # TestNG ITestListener for reporting/screenshots
│   └── factory/         # DriverFactory (Chrome/Firefox/Edge via config)
├── src/test/java/tests/ # Test classes calling Page Objects
├── src/test/resources/  # Test data (Excel/JSON/properties)
├── testng.xml           # Suite configuration, parallel execution, groups
├── pom.xml               # Maven dependencies + Surefire config
└── reports/              # Extent Reports / Allure output
```

**Key design decisions:**
- `DriverFactory` with `ThreadLocal<WebDriver>` so tests can run in parallel safely
- A `BasePage` with common reusable methods (`waitAndClick`, `waitAndType`, `getText`) that every Page Object extends
- **Explicit waits only** — no `Thread.sleep()` anywhere in the codebase
- **Data-driven** tests using Excel (Apache POI) or JSON, decoupled from test logic
- TestNG **listeners** for auto screenshot-on-failure and Extent Report generation
- **CI/CD** — Jenkins triggers `mvn test`, parameterized by environment/browser, and publishes reports

**Tip:** Always be ready to draw this out on a whiteboard/screen-share and explain *why* each layer exists — interviewers probe design decisions (Why ThreadLocal? Why explicit over implicit waits?) more than the folder names themselves.

---

### 2. Explain Selenium architecture?

Selenium WebDriver talks to the browser directly through each browser vendor's own **native automation driver** (ChromeDriver, GeckoDriver, EdgeDriver, etc.), using the **W3C WebDriver protocol** (a standardized HTTP-based wire protocol) — there's no central Selenium server involved for local `WebDriver` usage (that's only needed for **Selenium Grid**).

```
Test Script (Java)
      │
      │  Language Binding (Selenium Java client library — converts Java calls to
      │  W3C WebDriver protocol HTTP JSON commands)
      ▼
JSON Wire Protocol / W3C WebDriver Protocol (HTTP requests/responses)
      ▼
Browser Driver (ChromeDriver / GeckoDriver / EdgeDriver)
      │  (a standalone server that implements the WebDriver protocol
      │   and translates commands into browser-specific automation calls)
      ▼
Browser (Chrome / Firefox / Edge)
```

**Four core components:**

| Component | Role |
|-----------|------|
| **Selenium Client Library (bindings)** | Java/Python/C# APIs — converts your code (`driver.findElement(...)`) into WebDriver protocol commands |
| **JSON Wire Protocol / W3C WebDriver Protocol** | The standardized HTTP-based protocol used to send commands and receive responses |
| **Browser Drivers** | Browser-specific executables (`chromedriver.exe`, `geckodriver`) that receive protocol commands and translate them into native browser calls via each browser's automation API |
| **Browser** | The actual browser instance being automated |

```java
WebDriver driver = new ChromeDriver(); // Client library launches chromedriver.exe,
                                        // which in turn launches/attaches to Chrome
driver.get("https://example.com");
// Under the hood: Java client sends a JSON command over HTTP to chromedriver,
// chromedriver translates it into Chrome DevTools Protocol calls, Chrome executes it,
// and the result is returned back up the chain.
```

**Key point vs older Selenium 2 (RC) architecture:** Selenium 2+ (WebDriver) removed the old Selenium Core JavaScript injection approach — WebDriver talks to the browser natively via each browser's own driver, which is faster and avoids JavaScript sandbox restrictions that plagued Selenium RC.

---

### 3. What is parameterized testing in TestNG?

Parameterized testing lets the **same `@Test` method run multiple times with different input values**, instead of writing a separate test method per data set.

**TestNG offers three main ways:**

**1. `@Parameters` + `testng.xml` (fixed values from XML):**

```java
@Parameters({"username", "password"})
@Test
public void loginTest(String username, String password) {
    System.out.println("Logging in with: " + username + " / " + password);
    // driver.findElement(By.id("username")).sendKeys(username);
}
```

```xml
<test name="LoginTest">
    <parameter name="username" value="admin"/>
    <parameter name="password" value="Test1234"/>
    <classes>
        <class name="tests.LoginTest"/>
    </classes>
</test>
```

**2. `@DataProvider` (dynamic/programmatic data, most commonly used):**

```java
@DataProvider(name = "loginData")
public Object[][] getLoginData() {
    return new Object[][] {
        { "admin", "Test1234", true },
        { "admin", "wrongpass", false },
        { "unknownuser", "Test1234", false }
    };
}

@Test(dataProvider = "loginData")
public void loginTest(String username, String password, boolean expectedResult) {
    boolean actualResult = loginPage.login(username, password);
    Assert.assertEquals(actualResult, expectedResult);
}
```

**3. `@DataProvider` reading from an external source (Excel/JSON/CSV):**

```java
@DataProvider(name = "excelLoginData")
public Object[][] getDataFromExcel() throws IOException {
    return ExcelUtils.getTestData("testdata/login.xlsx", "LoginSheet");
}

@Test(dataProvider = "excelLoginData")
public void loginTestFromExcel(String username, String password) {
    loginPage.login(username, password);
}
```

**`@Parameters` vs `@DataProvider`:**

| Aspect | `@Parameters` | `@DataProvider` |
|--------|----------------|-------------------|
| Source of data | `testng.xml` | Java method (can pull from anywhere — Excel, DB, JSON) |
| Data type | Only Strings (static values) | Any object type, dynamic |
| Number of runs | Runs once per parameter set defined in XML | Runs once per row/array returned |
| Best for | Environment-level config (URL, browser) | Data-driven test scenarios (multiple login combos) |

---

### 4. How do you handle multiple windows in Selenium?

Selenium tracks each browser tab/window via a unique **window handle** (a string ID). `driver.getWindowHandle()` gets the current one; `driver.getWindowHandles()` returns a `Set<String>` of all open handles.

```java
String parentWindow = driver.getWindowHandle();

// Action that opens a new window/tab
driver.findElement(By.linkText("Open in new tab")).click();

// Wait until a new window handle appears
new WebDriverWait(driver, Duration.ofSeconds(10))
    .until(d -> d.getWindowHandles().size() > 1);

Set<String> allWindows = driver.getWindowHandles();
for (String handle : allWindows) {
    if (!handle.equals(parentWindow)) {
        driver.switchTo().window(handle);
        break;
    }
}

// Now interact with the new window
System.out.println("New window title: " + driver.getTitle());

// Close the new window and switch back
driver.close();
driver.switchTo().window(parentWindow);
```

**Selenium 4 way to explicitly open a new tab/window:**

```java
driver.switchTo().newWindow(WindowType.TAB);    // new tab
driver.switchTo().newWindow(WindowType.WINDOW); // new browser window
```

**Key points:**
- `driver.close()` closes only the **currently focused** window; `driver.quit()` closes the **entire browser session** (all windows) and ends the WebDriver process
- Always store the parent window handle **before** triggering the action that opens a new window, so you can reliably switch back
- Use a wait condition (handle count increased) instead of `Thread.sleep()` when waiting for a new window to open

---

### 5. How do you handle web tables (pagination) in Selenium? Count number of rows in a table

**Basic row/column count for a static table:**

```java
WebElement table = driver.findElement(By.id("productTable"));
List<WebElement> rows = table.findElements(By.tagName("tr"));
System.out.println("Total rows (including header): " + rows.size());

// Exclude header row
List<WebElement> dataRows = table.findElements(By.cssSelector("tbody tr"));
System.out.println("Total data rows: " + dataRows.size());

// Read a specific cell — row 2 (0-indexed: index 1), column 3
List<WebElement> cells = dataRows.get(1).findElements(By.tagName("td"));
System.out.println("Cell value: " + cells.get(2).getText());
```

**Counting rows across ALL pages of a paginated table:**

```java
public int getTotalRowCountAcrossPages(WebDriver driver) {
    int totalRows = 0;
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

    while (true) {
        List<WebElement> currentPageRows = driver.findElements(By.cssSelector("table tbody tr"));
        totalRows += currentPageRows.size();

        WebElement nextButton = driver.findElement(By.cssSelector(".pagination .next"));

        // Stop when "Next" is disabled — last page reached
        String disabledAttr = nextButton.getAttribute("class");
        if (disabledAttr != null && disabledAttr.contains("disabled")) {
            break;
        }

        nextButton.click();
        // Wait for the page/table to refresh before counting the next page
        wait.until(ExpectedConditions.stalenessOf(currentPageRows.get(0)));
    }
    return totalRows;
}
```

**Searching for a specific row/value across a paginated table:**

```java
public boolean findValueAcrossPages(WebDriver driver, String searchValue) {
    while (true) {
        List<WebElement> rows = driver.findElements(By.cssSelector("table tbody tr"));
        for (WebElement row : rows) {
            if (row.getText().contains(searchValue)) {
                return true; // found on current page
            }
        }

        WebElement nextButton = driver.findElement(By.cssSelector(".pagination .next"));
        if (nextButton.getAttribute("class").contains("disabled")) {
            break; // reached last page, not found
        }
        nextButton.click();
    }
    return false;
}
```

**Key points:**
- Always exclude the header row (`<thead>`) when counting **data** rows — use `tbody tr` rather than a blanket `tr`
- For paginated tables, use `ExpectedConditions.stalenessOf()` on a known element from the current page to reliably detect that the page has actually refreshed before re-counting (avoids stale/duplicate counts)
- Check the pagination "Next" button's disabled state (via class/attribute) to know when the last page has been reached, rather than assuming a fixed page count

---

### 6. Difference between implicit wait, explicit wait, and fluent wait?

| Aspect | Implicit Wait | Explicit Wait (`WebDriverWait`) | Fluent Wait |
|--------|-----------------|-----------------------------------|--------------|
| Scope | Global — applies to every `findElement` call on the driver | Specific to one element/condition | Specific to one element/condition |
| Condition | Only waits for element **presence** | Any `ExpectedCondition` (visible, clickable, text present, etc.) | Any custom condition (via lambda) |
| Polling interval | Fixed, not configurable | Fixed default (~500ms) | Fully configurable |
| Exception handling | N/A — just throws `NoSuchElementException` after timeout | Ignores `NoSuchElementException` only, by default | You choose exactly which exceptions to ignore |
| Best for | Simple, uniform waiting across the whole suite (used sparingly) | Most day-to-day explicit waiting needs | Elements with unpredictable timing / flaky third-party widgets |

```java
// Implicit — set ONCE, applies globally to the driver instance
driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));

// Explicit — targeted wait for a specific condition
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
wait.until(ExpectedConditions.elementToBeClickable(By.id("submit"))).click();

// Fluent — custom polling frequency + specific exceptions ignored
Wait<WebDriver> fluentWait = new FluentWait<>(driver)
        .withTimeout(Duration.ofSeconds(30))
        .pollingEvery(Duration.ofSeconds(2))
        .ignoring(NoSuchElementException.class)
        .ignoring(StaleElementReferenceException.class);

WebElement el = fluentWait.until(d -> d.findElement(By.id("dynamic-widget")));
```

**Best practice:** Don't mix implicit and explicit waits in the same test — the combination can cause unpredictable, compounding delays (e.g., implicit wait adding time on top of explicit wait's own polling). Most modern frameworks set implicit wait to `0` and rely entirely on explicit/fluent waits.

---

### 7. What is Page Object Model and why do we use it?

**Page Object Model (POM)** is a design pattern where each web page (or reusable component) is represented as a **class**, with its locators and interaction methods encapsulated inside that class — test code calls these methods instead of directly manipulating locators.

```java
public class LoginPage {
    private WebDriver driver;
    private By usernameField = By.id("username");
    private By passwordField = By.id("password");
    private By loginButton = By.id("login-btn");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
    }

    public void login(String username, String password) {
        driver.findElement(usernameField).sendKeys(username);
        driver.findElement(passwordField).sendKeys(password);
        driver.findElement(loginButton).click();
    }

    public String getErrorMessage() {
        return driver.findElement(By.className("error-msg")).getText();
    }
}
```

```java
// Test class — no locators here, just calls to Page Object methods
public class LoginTest {
    @Test
    public void testValidLogin() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.login("admin", "Test1234");
        Assert.assertTrue(driver.findElement(By.id("dashboard")).isDisplayed());
    }
}
```

**Why we use it:**

1. **Maintainability** — if a locator changes, it's updated in **one place** (the Page Object), not in every test that uses it
2. **Reusability** — the same page methods (`login()`, `search()`) can be reused across dozens of test cases
3. **Readability** — test code reads like business steps (`loginPage.login(...)`) instead of raw Selenium calls
4. **Separation of concerns** — test logic (assertions, flow) is separated from UI interaction logic (locators, actions)
5. **Reduced duplication** — avoids copy-pasting the same `findElement` + action code across multiple test classes

**Common enhancement — `PageFactory`:**

```java
public class LoginPage {
    @FindBy(id = "username")
    WebElement usernameField;

    @FindBy(id = "login-btn")
    WebElement loginButton;

    public LoginPage(WebDriver driver) {
        PageFactory.initElements(driver, this);
    }
}
```

`PageFactory` uses annotations (`@FindBy`) to initialize elements, but note that fields are lazily located by default — actual lookup happens on first use, so `StaleElementReferenceException` can still occur if the DOM changes underneath, same as with plain `driver.findElement()`.

---

### 8. How do you handle dropdowns, alerts, and iframes in Selenium?

**Dropdowns — using the `Select` class (for native `<select>` elements only):**

```java
Select dropdown = new Select(driver.findElement(By.id("country")));

dropdown.selectByVisibleText("India");
dropdown.selectByValue("IN");
dropdown.selectByIndex(2);

// Multi-select dropdown
List<WebElement> selectedOptions = dropdown.getAllSelectedOptions();
dropdown.deselectAll(); // only works if dropdown supports multiple selection

System.out.println("Is multiple select? " + dropdown.isMultiple());
```

**Custom (non-`<select>`) dropdowns — click-based interaction:**

```java
driver.findElement(By.className("dropdown-trigger")).click();
List<WebElement> options = driver.findElements(By.className("dropdown-option"));
for (WebElement option : options) {
    if (option.getText().equals("India")) {
        option.click();
        break;
    }
}
```

**Alerts:**

```java
driver.findElement(By.id("alert-btn")).click();
Alert alert = driver.switchTo().alert();

System.out.println(alert.getText());
alert.accept();   // OK
// alert.dismiss(); // Cancel
// alert.sendKeys("some text"); // only valid for prompt() alerts
```

**iFrames:**

```java
// Switch by index, ID/name, or WebElement
driver.switchTo().frame(0);
driver.switchTo().frame("iframeName");
driver.switchTo().frame(driver.findElement(By.id("payment-frame")));

driver.findElement(By.id("card-number")).sendKeys("4242424242424242");

// Always switch back to the main page after finishing work in the frame
driver.switchTo().defaultContent();

// For nested iframes — switch into the outer one first, then the inner
driver.switchTo().frame("outerFrame");
driver.switchTo().frame("innerFrame");
driver.switchTo().defaultContent(); // resets all the way out, not just one level
```

**Key points:**
- `Select` class only works on genuine `<select>` HTML elements — anything JS-rendered needs click-based handling
- `alert.sendKeys()` only works on `prompt()` dialogs, which have an input field
- `switchTo().defaultContent()` exits **all** frames back to the main document in one call — `switchTo().parentFrame()` exits just one level up in a nested-frame scenario

---

### 9. Which locators do you prefer in selenium and why?

**My preference order (most to least preferred):**

1. **`id`** — fastest and most reliable, assuming it's unique and stable (not auto-generated/dynamic)
2. **`name`** — nearly as reliable as `id`, common on form fields
3. **`CSS Selector`** — faster than XPath, widely supported, easy to combine attributes (`input[type='submit']`)
4. **`XPath`** — most powerful/flexible (can traverse up to parents, use `contains()`, `text()`), but generally slower and more brittle than CSS; I reach for it mainly when I need to locate by visible text or need parent/ancestor traversal
5. **`className` / `tagName`** — useful when combined with `findElements()` to get a collection, rarely unique enough alone
6. **`linkText` / `partialLinkText`** — fine for anchor tags with static, unique text

```java
// id — preferred first choice
driver.findElement(By.id("username"));

// CSS — preferred over XPath for attribute-based matching
driver.findElement(By.cssSelector("input[data-testid='login-submit']"));

// XPath — reached for when I need text-matching or DOM traversal
driver.findElement(By.xpath("//button[text()='Submit']/parent::div"));
```

**Why I avoid:**
- **Absolute XPath** (`/html/body/div[1]/div[2]/...`) — extremely brittle, breaks on any DOM structure change
- **Auto-generated dynamic IDs/classes** (e.g., `id="btn-8f3ac21"` that changes on every page load/build)

**Best practice I push for with dev teams:** getting `data-testid` attributes added to key elements — they're stable, purpose-built for automation, and decoupled from styling/CSS-class changes made during UI redesigns.

---

### 10. How do you handle StaleElementReferenceException?

**What causes it:** `StaleElementReferenceException` occurs when a previously located `WebElement` reference is no longer attached to the current DOM — typically because the page was refreshed, the element was removed/re-rendered (common in JS frameworks like React/Angular re-rendering a component), or you navigated away and back.

**Handling strategies:**

**1. Re-locate the element instead of reusing an old reference:**

```java
// Bad — reusing a stale reference after DOM changes
WebElement button = driver.findElement(By.id("submit"));
triggerSomeReRender();
button.click(); // may throw StaleElementReferenceException

// Good — re-locate right before use
driver.findElement(By.id("submit")).click();
```

**2. Wrap with a retry loop that re-locates on failure:**

```java
public void clickWithRetry(WebDriver driver, By locator, int maxAttempts) {
    int attempts = 0;
    while (attempts < maxAttempts) {
        try {
            driver.findElement(locator).click();
            return;
        } catch (StaleElementReferenceException e) {
            attempts++;
        }
    }
    throw new RuntimeException("Element remained stale after " + maxAttempts + " attempts: " + locator);
}
```

**3. Use `ExpectedConditions.refreshed()` with an explicit wait:**

```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement el = wait.until(
    ExpectedConditions.refreshed(
        ExpectedConditions.elementToBeClickable(By.id("submit"))
    )
);
el.click();
```

**4. Avoid storing `WebElement` references across steps that may re-render the DOM** — instead, store the `By` locator and re-find the element each time it's needed, especially inside Page Objects with `PageFactory` (which caches elements by default unless annotated with `@CacheLookup` explicitly opted out).

**Key point:** The fix is almost never "catch and ignore" — it's re-locating the element fresh right before interacting with it, since the old reference genuinely no longer points to anything valid in the current DOM.

---

### 11. Explain TestNG annotations and assertions?

**Common lifecycle annotations (execution order):**

| Annotation | When it runs |
|------------|----------------|
| `@BeforeSuite` | Once, before all tests in the suite |
| `@BeforeTest` | Before any test method in the `<test>` tag runs |
| `@BeforeClass` | Once, before the first method in the current class runs |
| `@BeforeMethod` | Before **each** `@Test` method |
| `@Test` | The actual test method |
| `@AfterMethod` | After **each** `@Test` method |
| `@AfterClass` | Once, after all methods in the current class have run |
| `@AfterTest` | After all test methods in the `<test>` tag have run |
| `@AfterSuite` | Once, after all tests in the suite finish |

```java
public class LoginTest {
    WebDriver driver;

    @BeforeClass
    public void setup() {
        driver = new ChromeDriver();
    }

    @BeforeMethod
    public void navigateToLoginPage() {
        driver.get("https://example.com/login");
    }

    @Test(priority = 1)
    public void testValidLogin() {
        // ...
    }

    @Test(priority = 2, dependsOnMethods = "testValidLogin")
    public void testLogout() {
        // ...
    }

    @AfterMethod
    public void screenshotOnFailure(ITestResult result) {
        if (result.getStatus() == ITestResult.FAILURE) {
            // capture screenshot
        }
    }

    @AfterClass
    public void teardown() {
        driver.quit();
    }
}
```

**Other useful `@Test` attributes:**

```java
@Test(priority = 1, dependsOnMethods = "login", groups = {"smoke", "regression"},
      enabled = true, timeOut = 5000, invocationCount = 3, retryAnalyzer = MyRetry.class)
```

**Assertions — Hard vs Soft:**

```java
// Hard assertion — stops execution of the test immediately on failure
Assert.assertEquals(actualTitle, "Dashboard");
Assert.assertTrue(driver.findElement(By.id("welcome")).isDisplayed());

// Soft assertion — collects all failures, doesn't stop execution mid-test
SoftAssert softAssert = new SoftAssert();
softAssert.assertEquals(actualTitle, "Dashboard");
softAssert.assertTrue(driver.findElement(By.id("welcome")).isDisplayed());
softAssert.assertAll(); // MUST be called at the end to actually report failures
```

**Hard vs Soft assertion — when to use which:**

| Aspect | `Assert` (hard) | `SoftAssert` (soft) |
|--------|-------------------|------------------------|
| On failure | Throws immediately, remaining steps in the test are skipped | Records the failure, test continues to run |
| Use case | When a failed check makes further steps meaningless (e.g., login failed → no point checking dashboard) | When verifying multiple independent things on one page (e.g., checking 5 different field values) and you want to see ALL failures in one run |
| Reporting | Fails and stops immediately | Reports all collected failures together, but only once `assertAll()` is called |

---

### 12. How do you achieve cross browser testing and parallel execution?

**Cross-browser testing — config-driven `DriverFactory`:**

```java
public class DriverFactory {
    public static WebDriver initDriver(String browserName) {
        WebDriver driver;
        switch (browserName.toLowerCase()) {
            case "chrome":
                driver = new ChromeDriver();
                break;
            case "firefox":
                driver = new FirefoxDriver();
                break;
            case "edge":
                driver = new EdgeDriver();
                break;
            default:
                throw new IllegalArgumentException("Unsupported browser: " + browserName);
        }
        driver.manage().window().maximize();
        return driver;
    }
}
```

```xml
<!-- testng.xml — pass the browser as a parameter -->
<suite name="CrossBrowserSuite">
    <test name="ChromeTest">
        <parameter name="browser" value="chrome"/>
        <classes><class name="tests.LoginTest"/></classes>
    </test>
    <test name="FirefoxTest">
        <parameter name="browser" value="firefox"/>
        <classes><class name="tests.LoginTest"/></classes>
    </test>
</suite>
```

```java
@Parameters("browser")
@BeforeMethod
public void setup(String browser) {
    driver = DriverFactory.initDriver(browser);
}
```

**Parallel execution — TestNG's built-in parallel modes via `testng.xml`:**

```xml
<!-- Run each <test> tag in a separate thread -->
<suite name="Suite" parallel="tests" thread-count="3">
    <test name="ChromeTest">...</test>
    <test name="FirefoxTest">...</test>
    <test name="EdgeTest">...</test>
</suite>

<!-- Run each test METHOD in a separate thread -->
<suite name="Suite" parallel="methods" thread-count="5">
    <test name="RegressionTest">
        <classes><class name="tests.LoginTest"/></classes>
    </test>
</suite>
```

**Making the driver thread-safe for parallel execution — `ThreadLocal<WebDriver>`:**

```java
public class DriverFactory {
    private static ThreadLocal<WebDriver> tlDriver = new ThreadLocal<>();

    public static void initDriver(String browserName) {
        WebDriver driver = /* create per browserName as above */;
        tlDriver.set(driver);
    }

    public static WebDriver getDriver() {
        return tlDriver.get();
    }
}
```

**Why `ThreadLocal` is essential:** Without it, a single static `WebDriver driver` field would be shared across all parallel threads, causing one thread's actions to interfere with another's browser session — `ThreadLocal` gives **each thread its own isolated `WebDriver` instance**.

**Scaling further — Selenium Grid / cloud platforms (BrowserStack, LambdaTest, Sauce Labs):** for running the same suite across many browser/OS combinations simultaneously without maintaining local browser installations, using `RemoteWebDriver` pointed at the Grid hub/cloud endpoint instead of a local driver.

```java
DesiredCapabilities caps = new DesiredCapabilities();
caps.setBrowserName("firefox");
WebDriver driver = new RemoteWebDriver(new URL("http://localhost:4444/wd/hub"), caps);
```

---

## 3. WestPharma — QA Automation Interview Questions (3+ Years)

*Recently asked interview questions at WestPharma for 3+ years experienced candidates.*

---

### 1. Reverse the words in a string

**Input:** `"Bengaluru is a vibrant city known as India's Silicon Valley"`
**Output:** `"Valley Silicon India's as known city vibrant a is Bengaluru"`

```java
public class ReverseWordsInString {
    public static void main(String[] args) {
        String input = "Bengaluru is a vibrant city known as India's Silicon Valley";
        System.out.println(reverseWords(input));
    }

    public static String reverseWords(String input) {
        String[] words = input.trim().split("\\s+");
        StringBuilder result = new StringBuilder();

        for (int i = words.length - 1; i >= 0; i--) {
            result.append(words[i]);
            if (i != 0) result.append(" ");
        }
        return result.toString();
    }
}
// Output: Valley Silicon India's as known city vibrant a is Bengaluru
```

**Without using `split()`/built-in helpers (pure two-pointer, in case that's the follow-up):**

```java
public static String reverseWordsManual(String input) {
    input = input.trim();
    StringBuilder result = new StringBuilder();
    int end = input.length();

    for (int i = input.length() - 1; i >= 0; i--) {
        if (input.charAt(i) == ' ') {
            result.append(input.substring(i + 1, end)).append(" ");
            end = i;
            // skip consecutive spaces
            while (i >= 0 && input.charAt(i) == ' ') i--;
            end = i + 1;
        }
    }
    result.append(input.substring(0, end));
    return result.toString();
}
```

**Complexity:** `O(n)` time, `O(n)` space (for the split array / builder). Interviewers often follow up with "now do it in-place" — the manual two-pointer version above is the answer to that.

---

### 2. What is Java Pool?

This most commonly refers to the **String Constant Pool** (also called the String Intern Pool) — a special memory region inside the JVM Heap where **String literals** are stored, so that identical string literals are reused instead of creating duplicate objects.

```java
String s1 = "Selenium";          // goes into the String Pool
String s2 = "Selenium";          // reuses the SAME object from the pool
String s3 = new String("Selenium"); // creates a NEW object on the heap, outside the pool

System.out.println(s1 == s2);        // true — same reference (both point to pooled object)
System.out.println(s1 == s3);        // false — different objects
System.out.println(s1.equals(s3));   // true — same content

String s4 = s3.intern(); // forces s3's value into the pool (or reuses it if already there)
System.out.println(s1 == s4); // true
```

**Why it exists:** Strings are immutable and heavily reused in Java programs, so the JVM optimizes memory by storing only one copy of each distinct literal value and letting all references to that literal point to the same object.

**Related "pool" concepts that sometimes come up in the same question:**

| Pool | What it is |
|------|-----------|
| **String Constant Pool** | Stores string literals for reuse (as above) |
| **Integer/Wrapper caching pool** | `Integer` caches values from -128 to 127 (`Integer.valueOf()`), similar reuse behavior for small autoboxed values |
| **Connection Pool** | (Not JVM-level) A pool of reusable database connections, managed by libraries like HikariCP — relevant if the question is really about backend/API test setup |
| **Thread Pool** | A pool of reusable worker threads (`ExecutorService`) — relevant for parallel test execution frameworks |

---

### 3. What is an Interface?

An **interface** in Java is a fully abstract type that defines a **contract** — a set of method signatures that any implementing class must provide. It specifies *what* a class should do, not *how*.

```java
public interface Page {
    void load();                       // abstract by default — no body
    boolean isLoaded();

    // Java 8+: default and static methods are allowed too
    default void refresh() {
        System.out.println("Refreshing page...");
    }

    static Page create(WebDriver driver) {
        return new LoginPage(driver);
    }
}

public class LoginPage implements Page {
    private WebDriver driver;

    public LoginPage(WebDriver driver) { this.driver = driver; }

    @Override
    public void load() { driver.get("https://example.com/login"); }

    @Override
    public boolean isLoaded() {
        return driver.findElements(By.id("login-form")).size() > 0;
    }
}
```

**Key characteristics:**
- All methods are `public abstract` by default (except `default`/`static`/`private` methods added since Java 8/9)
- A class can implement **multiple interfaces** (Java doesn't support multiple class inheritance, but does support multiple interface implementation) — this is how Java gets around the "diamond problem"
- Fields in an interface are implicitly `public static final` (constants)
- Cannot be instantiated directly (`new Page()` is invalid)

**Why it matters in automation frameworks:** Interfaces are commonly used to define a contract for interchangeable implementations — e.g., a `BrowserActions` interface implemented separately for Selenium and Playwright, or a `ReportGenerator` interface implemented by `ExtentReportGenerator` and `AllureReportGenerator`, allowing the framework to swap implementations without changing calling code.

---

### 4. Which Java Collection contains only unique values?

The **`Set`** interface (and its implementations) — `Set` does not allow duplicate elements; adding a duplicate silently returns `false` and leaves the set unchanged.

| Implementation | Ordering | Notes |
|-----------------|-----------|-------|
| `HashSet` | No guaranteed order | Fastest, backed by a hash table |
| `LinkedHashSet` | Insertion order preserved | Backed by a hash table + linked list |
| `TreeSet` | Sorted order (natural or via `Comparator`) | Backed by a Red-Black tree, `O(log n)` operations |

```java
Set<String> uniqueEmails = new HashSet<>();
uniqueEmails.add("admin@test.com");
uniqueEmails.add("user@test.com");
uniqueEmails.add("admin@test.com"); // duplicate — ignored, returns false

System.out.println(uniqueEmails.size()); // 2, not 3

// Practical use: dedupe a list of emails collected during a test run
List<String> allEmails = Arrays.asList("a@x.com", "b@x.com", "a@x.com");
Set<String> distinctEmails = new HashSet<>(allEmails);
System.out.println(distinctEmails.size()); // 2
```

**Note:** `Map` keys are also unique (that's how `HashMap`/`LinkedHashMap`/`TreeMap` enforce one value per key), but the question specifically about a collection *of values* with uniqueness enforced is `Set`.

---

### 5. Difference between Method Overloading and Method Overriding

| Aspect | Method Overloading | Method Overriding |
|--------|----------------------|----------------------|
| Definition | Same method name, different parameter list, same class | Subclass redefines a method with the exact same signature as its parent |
| Binding | Resolved at **compile time** (static binding) | Resolved at **runtime** (dynamic binding) |
| Inheritance required | No | Yes |
| Return type | Can differ | Must be same or covariant |
| Purpose | Compile-time polymorphism | Runtime polymorphism |

```java
// OVERLOADING — same class, different parameter lists
class WaitUtils {
    public void waitFor(WebElement element) {
        new WebDriverWait(driver, Duration.ofSeconds(10)).until(ExpectedConditions.visibilityOf(element));
    }
    public void waitFor(WebElement element, int seconds) {
        new WebDriverWait(driver, Duration.ofSeconds(seconds)).until(ExpectedConditions.visibilityOf(element));
    }
}

// OVERRIDING — subclass redefines parent's behavior
class BasePage {
    public void waitForPageLoad() {
        System.out.println("Generic page load wait");
    }
}
class DashboardPage extends BasePage {
    @Override
    public void waitForPageLoad() {
        System.out.println("Waiting for dashboard widgets to load");
    }
}
```

---

### 6. Difference between HTTP PUT and PATCH

| Aspect | PUT | PATCH |
|--------|-----|-------|
| Purpose | **Replaces** the entire resource | **Partially updates** the resource — only specified fields |
| Payload | Must contain the **complete** representation of the resource | Contains only the fields that need to change |
| Idempotency | Idempotent — repeating the same PUT produces the same result | Idempotent in typical usage, though not guaranteed by spec depending on how the patch is applied |
| Missing fields | Fields not included are typically **overwritten with null/default** | Fields not included are **left untouched** |

```java
// PUT — must send the FULL object; any field omitted may get wiped/defaulted
given()
    .contentType("application/json")
    .body("{ \"id\": 1, \"name\": \"John\", \"email\": \"john@test.com\", \"age\": 30 }")
    .when().put("/users/1")
    .then().statusCode(200);

// PATCH — send ONLY the field(s) that need updating
given()
    .contentType("application/json")
    .body("{ \"age\": 31 }")
    .when().patch("/users/1")
    .then().statusCode(200);
```

**Practical testing implication:** When writing API test cases, a PUT test should verify that omitted fields get reset/cleared (since it's a full replace), while a PATCH test should verify that all *other* fields remain unchanged and only the sent field was updated.

---

### 7. Which Java Collection would you use to maintain the insertion order of products displayed on a website?

**`LinkedHashMap`** (if products need a key, e.g., product ID → product details) or **`LinkedHashSet`** (if you just need a unique, ordered collection of product names/IDs with no associated value) — both preserve the exact order elements were inserted, unlike `HashMap`/`HashSet` which give no ordering guarantee.

```java
// LinkedHashMap — product ID mapped to product name, in display order
Map<String, String> displayedProducts = new LinkedHashMap<>();
displayedProducts.put("P101", "Wireless Mouse");
displayedProducts.put("P102", "Mechanical Keyboard");
displayedProducts.put("P103", "USB-C Hub");

for (Map.Entry<String, String> entry : displayedProducts.entrySet()) {
    System.out.println(entry.getKey() + " -> " + entry.getValue());
}
// Always prints in the exact order they were added — matches UI display order

// LinkedHashSet — just unique product names, insertion order preserved
Set<String> productNames = new LinkedHashSet<>();
productNames.add("Wireless Mouse");
productNames.add("Mechanical Keyboard");
```

**Why not `TreeMap`/`TreeSet`:** Those sort by natural/comparator order (e.g., alphabetically), which would NOT match the actual order products appear on the website — the requirement here is specifically insertion order, which only `LinkedHashMap`/`LinkedHashSet` (or a plain `List`, if uniqueness isn't required) guarantee.

---

### 8. Difference between git fetch and git pull

| Command | Behavior |
|---------|----------|
| `git fetch` | Downloads commits/refs from the remote into local **remote-tracking branches** (e.g., `origin/main`) — does **not** touch your working branch |
| `git pull` | `git fetch` + `git merge` (or `git rebase` with `--rebase`) in one step — automatically integrates the fetched changes into your current branch |

```bash
git fetch origin              # See what's new on origin, without changing your branch
git log HEAD..origin/main     # Review incoming commits before merging
git merge origin/main         # Merge manually, once reviewed

# vs.
git pull origin main          # Fetch + merge in a single command
git pull --rebase origin main # Fetch + rebase instead of merge
```

**Why prefer `fetch` over `pull` sometimes:** `git fetch` lets you inspect incoming changes to a shared automation framework repo before merging — safer when working on a feature branch and you want to avoid unexpected conflicts or a surprise merge commit landing mid-work.

---

### 9. Difference between BDD and Data-Driven Testing

These solve **different problems** and are often combined, not alternatives to each other.

| Aspect | BDD (Behavior-Driven Development) | Data-Driven Testing |
|--------|--------------------------------------|--------------------------|
| Primary goal | Express test scenarios in business-readable language (`Given/When/Then`) for collaboration between QA, Dev, and Business | Run the **same test logic** repeatedly with **different input data sets** |
| Focus | *Behavior* and *readability* | *Data variation* and *coverage* |
| Typical tooling | Cucumber, SpecFlow, JBehave | TestNG `@DataProvider`, JUnit `@ParameterizedTest`, Excel/CSV/JSON-driven loops |
| Example | `Given user is on login page / When user enters valid credentials / Then dashboard is displayed` | Running the login test once each for 20 different username/password combinations from an Excel sheet |

**They combine naturally** — a Cucumber `Scenario Outline` with an `Examples` table is BDD **and** data-driven at the same time:

```gherkin
Scenario Outline: Login with multiple credential sets
  Given user navigates to the login page
  When user enters username "<username>" and password "<password>"
  Then the result should be "<result>"

  Examples:
    | username | password  | result  |
    | admin    | Test1234  | Success |
    | admin    | wrongpass | Failure |
```

**Key distinction to state clearly in an interview:** BDD is about **how the scenario is described and structured** (for stakeholder collaboration); data-driven testing is about **how many times and with what inputs** the underlying logic executes. One is a documentation/collaboration approach, the other is an execution/coverage technique.

---

### 10. How do you switch Selenium execution between Chrome and Microsoft Edge?

Same approach as general cross-browser support — abstract driver creation behind a factory method driven by a config value/parameter, rather than hardcoding a specific `WebDriver` implementation in test code.

```java
public class DriverFactory {
    public static WebDriver initDriver(String browserName) {
        WebDriver driver;
        switch (browserName.trim().toLowerCase()) {
            case "chrome":
                driver = new ChromeDriver();
                break;
            case "edge":
                EdgeOptions edgeOptions = new EdgeOptions();
                driver = new EdgeDriver(edgeOptions);
                break;
            default:
                throw new IllegalArgumentException("Unsupported browser: " + browserName);
        }
        driver.manage().window().maximize();
        return driver;
    }
}
```

**Driving the switch via `testng.xml` parameter (no code change needed to switch browsers):**

```xml
<test name="EdgeRun">
    <parameter name="browser" value="edge"/>
    <classes><class name="tests.LoginTest"/></classes>
</test>
```

```java
@Parameters("browser")
@BeforeMethod
public void setup(String browser) {
    driver = DriverFactory.initDriver(browser);
}
```

**Driving it via Maven command line (common in CI):**

```bash
mvn test -Dbrowser=edge
```

```java
String browser = System.getProperty("browser", "chrome"); // defaults to chrome
driver = DriverFactory.initDriver(browser);
```

**Key points:**
- Selenium 4+ ships Chromium-based `EdgeDriver` support natively (`org.openqa.selenium.edge.EdgeDriver`), since Edge is now Chromium-based and largely mirrors Chrome's driver behavior
- Selenium Manager (built into Selenium 4.6+) automatically downloads and manages the correct `chromedriver`/`msedgedriver` binary for the installed browser version — no manual driver executable management needed
- Keep browser selection entirely outside test logic (config/parameter-driven) so switching is a one-line change, not a code change

---

### 11. Explain the Defect Life Cycle

The **Defect Life Cycle** (Bug Life Cycle) describes the various states a defect goes through from the moment it is identified until it is closed/verified.

**Typical states and flow:**

```
New → Assigned → Open (In Progress) → Fixed → Retest → Verified → Closed
                     │                                      │
                     ├──→ Rejected (not a valid defect)      ├──→ Reopened (fix didn't work)
                     ├──→ Deferred (fixed in a future release)
                     └──→ Duplicate (already logged)
```

| State | Meaning |
|-------|---------|
| **New** | Defect logged by the tester for the first time |
| **Assigned** | Triaged and assigned to a developer for fixing |
| **Open / In Progress** | Developer is actively working on the fix |
| **Fixed** | Developer has completed the fix and deployed it to the test environment |
| **Retest** | Tester re-executes the originally failing test case to verify the fix |
| **Verified** | Fix confirmed working — the retest passed |
| **Closed** | Defect fully resolved and confirmed closed by the tester/lead |
| **Reopened** | Retest failed — the issue still exists or reappeared, sent back to the developer |
| **Rejected** | Developer/lead determines it's not a genuine defect (e.g., misunderstanding of requirement, works as designed) |
| **Deferred** | Valid defect but postponed to a future release due to priority/timeline |
| **Duplicate** | Same defect already logged under a different ID |

**As a tester, my responsibilities across this cycle:**
1. **Log clearly** — steps to reproduce, expected vs actual result, environment, severity, priority, screenshots/logs
2. **Set severity and priority correctly** — severity = impact on the system, priority = urgency to fix (these aren't the same and are sometimes tested as a separate question)
3. **Retest promptly** once marked "Fixed," using the exact original repro steps
4. **Reopen with fresh evidence** if the retest fails, rather than just changing status
5. **Track through closure** so nothing silently falls off the board before release

**Severity vs Priority — a common follow-up:**

| | Severity | Priority |
|--|----------|----------|
| Definition | How badly the defect impacts the application's functionality | How urgently it needs to be fixed, from a business perspective |
| Set by | QA/Tester | Product Owner/Business, often in consultation with QA |
| Example | App crashes on checkout = **High severity** | A typo on the homepage might be **Low severity but High priority** if a VIP client is visiting today |

---

---

## 4. Wipro — QA Automation Testing Interview Questions (4 Years Experience, L1)

*Round 1 (L1) interview questions shared by a candidate with 4 years of QA Automation Testing experience. Covers a broad range of topics including Java, Selenium, TestNG, Maven, API testing, SQL, Git, AI tools, and testing fundamentals.*

---

### 1. Please introduce yourself along with your work experience.

**Sample Answer:**

"Hi, I'm [Your Name], a QA Automation Engineer with 4 years of experience in designing, developing, and maintaining automation test frameworks. I currently work at [Company] where I'm responsible for end-to-end test automation for web applications.

**My experience includes:**
- Building and maintaining Selenium + Java automation frameworks using the Page Object Model (POM)
- Writing functional, regression, and smoke test suites using TestNG
- API testing using Postman and RestAssured
- CI/CD integration with Jenkins/Azure DevOps for automated test execution
- Version control and collaboration using Git/GitHub
- Working in Agile/Scrum environments with 2-week sprint cycles

**Key achievements:**
- Automated 200+ regression test cases reducing manual effort by 60%
- Integrated automated tests into CI/CD pipeline, enabling continuous testing on every build
- Mentored 2 junior QA engineers on framework usage and best practices

**Tech stack:** Selenium WebDriver, Java, TestNG, Maven, Cucumber BDD, Jenkins, Git, RestAssured, Postman, SQL."

**Tips:**
- Keep it under 2 minutes
- Structure: Intro → Experience summary → Current role → Key skills → Achievements
- Tailor to the job description — highlight skills that match Wipro's requirements
- Quantify impact wherever possible

---

### 2. What was your project? Can you explain your project?

**Sample Answer:**

"I'm currently working on an **e-commerce platform** (or *banking/insurance/healthcare portal* — adapt to your actual project) that allows users to browse products, place orders, manage accounts, and track deliveries.

**My role in the project:**
- Owned the automation framework built with **Selenium + Java + TestNG + Maven** following the **Page Object Model (POM)** design pattern
- Automated critical user flows: user registration, login, product search, add-to-cart, checkout, payment, and order tracking
- Performed both **UI automation** and **API testing** (REST APIs for order management, user authentication)
- Participated in **sprint planning**, **daily standups**, and **sprint retrospectives** as part of the Agile team

**Application architecture:**
- Frontend: React-based single-page application
- Backend: Microservices architecture with REST APIs
- Database: MySQL/PostgreSQL
- Deployment: Cloud-based (AWS/Azure), with staging and production environments

**Testing scope:**
- Functional testing, regression testing, smoke testing, sanity testing
- Cross-browser testing (Chrome, Firefox, Edge)
- Integration testing for API endpoints
- Database validation using SQL queries"

**Tips:**
- Explain the **domain** briefly, then focus on your **specific role and contribution**
- Mention the **tech stack** used
- Talk about **types of testing** you performed
- Be prepared for follow-up questions on specific modules you tested

---

### 3. What are the different test design techniques?

Test design techniques are systematic methods for creating effective test cases. They are broadly categorized into:

**1. Black-Box Techniques** (No code knowledge needed):

| Technique | Description | Example |
|-----------|-------------|---------|
| **Equivalence Partitioning** | Divide inputs into valid/invalid groups; test one value from each | Age field: valid (18-60), invalid (<18, >60) — test 25, 10, 65 |
| **Boundary Value Analysis** | Test at the boundaries of equivalence classes | Age: test 17, 18, 19, 59, 60, 61 |
| **Decision Table Testing** | Test combinations of conditions and their resulting actions | Login: valid/invalid username × valid/invalid password = 4 combinations |
| **State Transition Testing** | Test transitions between different states of the system | Account: Active → Locked (after 3 failed logins) → Active (after reset) |
| **Error Guessing** | Use experience and intuition to guess likely error-prone areas | Empty fields, special characters, SQL injection attempts |
| **Use Case Testing** | Test end-to-end user scenarios based on use cases | Complete checkout flow from product search to order confirmation |

**2. White-Box Techniques** (Requires code knowledge):

| Technique | Description |
|-----------|-------------|
| **Statement Coverage** | Every statement in the code is executed at least once |
| **Branch/Decision Coverage** | Every branch (if/else) is executed at least once |
| **Path Coverage** | Every possible execution path through the code is tested |
| **Condition Coverage** | Every Boolean sub-expression is tested for both true and false |

**3. Experience-Based Techniques:**
- **Exploratory Testing** — Simultaneous learning, test design, and test execution
- **Error Guessing** — Based on tester's experience with similar applications
- **Checklist-Based Testing** — Tests based on a predefined checklist

---

### 4. What is Regression Testing, Sanity Testing, and Smoke Testing? Explain with a single example.

Consider an **e-commerce application** where a bug in the "Add to Cart" button was reported and fixed by the developer.

| Testing Type | Definition | Example with the "Add to Cart" fix |
|-------------|------------|-------------------------------------|
| **Smoke Testing** | Quick, broad check to verify the build is stable enough for further testing. Tests critical paths at a high level. | After the new build is deployed, verify: Can the app load? Can users log in? Can they search products? Can they see product pages? *(Basic health check — not focused on the fix itself)* |
| **Sanity Testing** | Narrow, focused check to verify the specific bug fix or new feature works correctly. | Specifically test the "Add to Cart" button: Does it add items? Does the cart count update? Does it work for different product types? *(Focused only on the area that was changed)* |
| **Regression Testing** | Comprehensive testing to ensure the fix didn't break any existing functionality. | Test the full checkout flow: Add to Cart → View Cart → Update Quantity → Apply Coupon → Checkout → Payment → Order Confirmation. Also test Wishlist, Remove from Cart, and other related features. *(Ensures nothing else broke due to the fix)* |

```
Build deployed → Smoke Test (build stable?) → Sanity Test (fix works?) → Regression Test (nothing else broke?)
```

**Key distinction:**
- **Smoke** = Broad + Shallow ("Is the building on fire?")
- **Sanity** = Narrow + Deep ("Does this specific thing work?")
- **Regression** = Broad + Deep ("Did fixing X break Y or Z?")

---

### 5. What are the disadvantages of an Array in Java?

| Disadvantage | Explanation |
|-------------|-------------|
| **Fixed size** | Once an array is created, its size cannot be changed. You must know the size upfront or waste memory by over-allocating. |
| **No built-in methods** | Arrays lack utility methods like `add()`, `remove()`, `contains()`, `sort()` — you must write manual logic or use `Arrays` utility class. |
| **Homogeneous type only** | An array can hold only one data type (e.g., `int[]` can't hold `String` values). |
| **No bounds checking at compile time** | `ArrayIndexOutOfBoundsException` occurs at runtime if you access an invalid index. |
| **Insertion/deletion is expensive** | Adding or removing elements in the middle requires shifting all subsequent elements — O(n) operation. |
| **Memory waste** | If you allocate `new int[1000]` but only use 10 elements, 990 slots are wasted. |
| **No direct support for key-value pairs** | Arrays store only values, not key-value mappings. |

```java
// Demonstrating array limitations
int[] numbers = new int[5]; // Fixed size — can't grow
numbers[0] = 10;
numbers[1] = 20;
// numbers[5] = 60; // ArrayIndexOutOfBoundsException!

// Inserting at index 1 requires manual shifting
int[] newArr = new int[6];
System.arraycopy(numbers, 0, newArr, 0, 1);
newArr[1] = 15; // new element
System.arraycopy(numbers, 1, newArr, 2, 4); // shift rest
```

**What to use instead:** See Question 18 below.

---

### 6. What are the annotations in TestNG? Can you explain POM?

**TestNG Annotations:**

| Annotation | Description | Execution Order |
|------------|-------------|------------------|
| `@BeforeSuite` | Runs once before the entire test suite | 1st |
| `@BeforeTest` | Runs before each `<test>` tag in testng.xml | 2nd |
| `@BeforeClass` | Runs once before the first test method in the current class | 3rd |
| `@BeforeMethod` | Runs before each `@Test` method | 4th |
| `@Test` | Marks a method as a test case | 5th |
| `@AfterMethod` | Runs after each `@Test` method | 6th |
| `@AfterClass` | Runs once after all test methods in the current class | 7th |
| `@AfterTest` | Runs after all test methods in the `<test>` tag | 8th |
| `@AfterSuite` | Runs once after the entire test suite | 9th |
| `@DataProvider` | Supplies test data to a `@Test` method for data-driven testing | N/A |
| `@Parameters` | Passes parameters from testng.xml to test methods | N/A |

```java
public class SampleTest {
    @BeforeClass
    public void setUp() { System.out.println("Setup: Launch browser"); }

    @BeforeMethod
    public void navigateToPage() { System.out.println("Navigate to URL"); }

    @Test(priority = 1)
    public void loginTest() { System.out.println("Login test executed"); }

    @Test(priority = 2)
    public void searchTest() { System.out.println("Search test executed"); }

    @AfterMethod
    public void clearData() { System.out.println("Clear test data"); }

    @AfterClass
    public void tearDown() { System.out.println("Teardown: Close browser"); }
}
```

**Page Object Model (POM):**

POM is a **design pattern** in Selenium that creates an **object repository** for web UI elements. Each web page is represented as a separate Java class containing:
- **Locators** — element identifiers (By, `@FindBy`)
- **Methods** — actions performed on those elements

**Benefits:**
- **Code reusability** — page methods reused across multiple tests
- **Easy maintenance** — UI changes require updates in only one place (the Page class)
- **Readability** — test methods read like user actions, not low-level Selenium code
- **Separation of concerns** — test logic is separated from page-specific implementation

```java
// Page Object class
public class LoginPage {
    WebDriver driver;

    // Locators
    @FindBy(id = "username") WebElement usernameField;
    @FindBy(id = "password") WebElement passwordField;
    @FindBy(id = "loginBtn") WebElement loginButton;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    // Actions
    public void enterUsername(String username) { usernameField.sendKeys(username); }
    public void enterPassword(String password) { passwordField.sendKeys(password); }
    public DashboardPage clickLogin() {
        loginButton.click();
        return new DashboardPage(driver);
    }
}

// Test class using the Page Object
public class LoginTest {
    @Test
    public void verifyLogin() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.enterUsername("admin");
        loginPage.enterPassword("Test@123");
        DashboardPage dashboard = loginPage.clickLogin();
        Assert.assertTrue(dashboard.isDisplayed());
    }
}
```

---

### 7. Have you worked on API Testing?

**Sample Answer:**

"Yes, I have experience in API testing using both **Postman** (manual) and **RestAssured** (automation).

**What I've done:**
- Tested RESTful APIs for CRUD operations (GET, POST, PUT, DELETE)
- Validated response **status codes**, **response body** (JSON), **headers**, and **response time**
- Created **Postman collections** with environment variables, pre-request scripts, and test scripts
- Automated API tests using **RestAssured** in Java integrated with TestNG
- Performed **data-driven API testing** using external data files
- Validated API contracts and schema using JSON Schema validation

```java
// RestAssured example — GET request
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

@Test
public void getUsers() {
    given()
        .baseUri("https://api.example.com")
        .header("Authorization", "Bearer " + token)
    .when()
        .get("/users")
    .then()
        .statusCode(200)
        .body("users.size()", greaterThan(0))
        .body("users[0].name", notNullValue());
}

// POST request
@Test
public void createUser() {
    String requestBody = "{\"name\": \"John\", \"email\": \"john@test.com\"}";

    given()
        .contentType(ContentType.JSON)
        .body(requestBody)
    .when()
        .post("/users")
    .then()
        .statusCode(201)
        .body("name", equalTo("John"));
}
```

---

### 8. Can you write an XPath for the Sign In button on Amazon.in?

```java
// Various XPath strategies for Amazon.in Sign In button

// 1. Using text content
By.xpath("//a[contains(text(),'Sign in')]");

// 2. Using the id attribute of the sign-in link/container
By.xpath("//a[@id='nav-link-accountList']");

// 3. Using data-nav-role attribute
By.xpath("//a[@data-nav-role='signin']");

// 4. Using the span text inside the navigation
By.xpath("//span[text()='Hello, sign in']");

// 5. Using partial link text approach with XPath
By.xpath("//a[contains(@href, 'signin')]");

// 6. CSS Selector alternative
By.cssSelector("a#nav-link-accountList");
```

**Tips for writing robust XPaths:**
- Always inspect the element in DevTools (F12) first
- Prefer `id` or unique attributes over positional XPaths like `//div[3]/a[1]`
- Use `contains()` for dynamic or partial attribute values
- Avoid overly long, fragile absolute XPaths
- Test your XPath in the browser console: `$x("your-xpath-here")`

---

### 9. Can we override private methods in Java?

**No, private methods cannot be overridden in Java.**

**Reasons:**
- **Private methods are not visible** to subclasses — they are accessible only within the class where they are declared
- **Overriding requires inheritance-based method resolution** (runtime polymorphism), but since private methods aren't inherited, there's nothing to override
- If a subclass defines a method with the same name and signature as a parent's private method, it's a **completely new method**, not an override — this is called **method hiding** (though "hiding" is more precisely used for static methods)

```java
class Parent {
    private void display() {
        System.out.println("Parent's private method");
    }

    public void callDisplay() {
        display(); // Calls Parent's own private method — always
    }
}

class Child extends Parent {
    // This is NOT overriding — it's a completely independent method
    private void display() {
        System.out.println("Child's method (not an override)");
    }
}

public class Test {
    public static void main(String[] args) {
        Parent obj = new Child();
        obj.callDisplay(); // Output: "Parent's private method" — NOT Child's
    }
}
```

**Summary of what can/cannot be overridden:**

| Access Modifier | Can Override? |
|----------------|---------------|
| `public` | ✅ Yes |
| `protected` | ✅ Yes |
| Default (package-private) | ✅ Yes (within same package) |
| `private` | ❌ No |
| `static` methods | ❌ No (method hiding, not overriding) |
| `final` methods | ❌ No |

---

### 10. What AI tools have you used?

**Sample Answer:**

"I've incorporated AI tools into my testing workflow to improve efficiency:

| AI Tool | How I've Used It |
|---------|------------------|
| **ChatGPT / Gemini** | Generating test case ideas, writing boilerplate code, debugging test failures, understanding complex error logs |
| **GitHub Copilot** | Code auto-completion while writing Selenium test scripts, generating utility methods, suggesting assertions |
| **Postman AI (Postbot)** | Auto-generating API test scripts, creating documentation, suggesting test scenarios for endpoints |
| **Testim / Mabl / Katalon AI** | AI-powered test maintenance — self-healing locators that adapt when UI changes |
| **Antigravity IDE** | AI-assisted coding, code generation, debugging, and pair programming for automation frameworks |

**Practical examples:**
- Used ChatGPT to generate edge-case test scenarios for a complex form with 15+ fields
- Used GitHub Copilot to accelerate Page Object creation — it auto-suggests locators and action methods based on page structure
- Used AI tools to analyze flaky test logs and identify root causes faster

**Important note:** I always **review and validate** AI-generated code/test cases — AI is a productivity tool, not a replacement for domain expertise and critical thinking."

---

### 11. Can you write a Java program to reverse a string without altering the original structure: "Pune Delhi Mumbai"

**Goal:** Reverse each word individually while keeping the word order and spacing intact.

**Input:** `"Pune Delhi Mumbai"`
**Output:** `"enuP ihleD iabmuM"`

```java
public class ReverseWordsStructure {
    public static void main(String[] args) {
        String input = "Pune Delhi Mumbai";
        System.out.println("Input:  " + input);
        System.out.println("Output: " + reverseEachWord(input));
    }

    public static String reverseEachWord(String input) {
        String[] words = input.split(" ");
        StringBuilder result = new StringBuilder();

        for (int i = 0; i < words.length; i++) {
            StringBuilder word = new StringBuilder(words[i]);
            result.append(word.reverse());
            if (i < words.length - 1) {
                result.append(" ");
            }
        }
        return result.toString();
    }
}
// Output: "enuP ihleD iabmuM"
```

**Alternative interpretation — reverse the order of words (not the characters):**

```java
public static String reverseWordOrder(String input) {
    String[] words = input.split(" ");
    StringBuilder result = new StringBuilder();

    for (int i = words.length - 1; i >= 0; i--) {
        result.append(words[i]);
        if (i > 0) result.append(" ");
    }
    return result.toString();
}
// Input:  "Pune Delhi Mumbai"
// Output: "Mumbai Delhi Pune"
```

**Key point:** Clarify with the interviewer which interpretation they mean — reversing each word's characters, or reversing the word order. Both are common interview questions.

---

### 12. What are the other test design techniques apart from Equivalence Partitioning and Boundary Value Analysis?

| Technique | Description | Example |
|-----------|-------------|---------|
| **Decision Table Testing** | Maps all combinations of conditions to actions in a table format | Login: valid/invalid username × valid/invalid password |
| **State Transition Testing** | Tests transitions between system states based on events | Account: Active → Locked → Suspended → Closed |
| **Use Case Testing** | Tests complete user scenarios end-to-end | Full e-commerce checkout flow |
| **Error Guessing** | Leverages tester's experience to predict error-prone areas | Null inputs, empty strings, special characters, SQL injection |
| **Exploratory Testing** | Simultaneous learning, test design, and execution without predefined scripts | Freely navigating a new feature to discover unexpected behaviors |
| **Pairwise / Combinatorial Testing** | Tests all possible pairs of input combinations efficiently | Browser × OS × Screen Resolution — test all pairs, not all combinations |
| **Checklist-Based Testing** | Based on a predefined checklist derived from experience | UI checklist: alignment, fonts, colors, responsiveness |
| **Classification Tree Method** | Visual representation of test input domains as a tree structure | Input domain decomposition for a complex search form |
| **Cause-Effect Graphing** | Maps causes (inputs) to effects (outputs) graphically | Multiple input conditions affecting system behavior |

**In practice,** I primarily use Equivalence Partitioning and BVA for field-level validation, Decision Tables for business logic with multiple conditions, and State Transition Testing for workflow-based features.

---

### 13. Can you explain the project structure in Maven?

Maven follows a **convention-over-configuration** approach with a standard directory structure:

```
project-root/
├── pom.xml                          # Project Object Model — Maven configuration file
├── src/
│   ├── main/
│   │   ├── java/                    # Application source code
│   │   │   └── com/company/app/
│   │   │       ├── pages/           # Page Object classes (in automation frameworks)
│   │   │       ├── utils/           # Utility/helper classes
│   │   │       └── base/            # Base classes (driver setup, config)
│   │   └── resources/               # Non-code resources (config files, properties)
│   │       └── config.properties
│   └── test/
│       ├── java/                    # Test source code
│       │   └── com/company/tests/
│       │       ├── LoginTest.java
│       │       └── SearchTest.java
│       └── resources/               # Test resources (test data, feature files)
│           ├── testdata/
│           │   └── testData.xlsx
│           └── features/            # Cucumber feature files (if BDD)
│               └── login.feature
├── target/                          # Generated output (compiled classes, reports, JARs)
│   ├── classes/
│   ├── test-classes/
│   └── surefire-reports/            # TestNG/JUnit test reports
└── testng.xml                       # TestNG suite configuration
```

**Key elements of `pom.xml`:**

```xml
<project>
    <groupId>com.company</groupId>         <!-- Organization identifier -->
    <artifactId>automation-framework</artifactId>  <!-- Project name -->
    <version>1.0-SNAPSHOT</version>         <!-- Version -->
    <packaging>jar</packaging>

    <dependencies>
        <!-- Selenium -->
        <dependency>
            <groupId>org.seleniumhq.selenium</groupId>
            <artifactId>selenium-java</artifactId>
            <version>4.20.0</version>
        </dependency>
        <!-- TestNG -->
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>7.10.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <configuration>
                    <suiteXmlFiles>
                        <suiteXmlFile>testng.xml</suiteXmlFile>
                    </suiteXmlFiles>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

**Maven repositories (see also Question 23):**
- **Local Repository** (`~/.m2/repository`) — cached dependencies on your machine
- **Central Repository** (`repo.maven.apache.org`) — default public repository
- **Remote/Private Repository** (Nexus, Artifactory) — organization-hosted

---

### 14. What is a 500 status code?

**HTTP 500 — Internal Server Error**

It means the **server encountered an unexpected condition** that prevented it from fulfilling the request. The problem is on the **server side**, not the client side.

**Key characteristics:**
- The server knows something went wrong but can't provide a more specific error
- Often caused by: unhandled exceptions in server code, database connection failures, null pointer exceptions, misconfigured server, deployment issues
- The client's request may have been perfectly valid

**As a tester, when I encounter a 500 error, I:**
1. **Log it as a defect** with the request URL, method, headers, request body, and the 500 response
2. **Check server logs** (if accessible) to identify the root cause
3. **Reproduce consistently** — determine if it happens always or intermittently
4. **Verify the request** — ensure the request payload is valid (eliminate client-side issues)
5. **Report with severity** — a 500 error in a critical flow (e.g., checkout, payment) is a **Blocker/Critical** defect

See also: **Question 17** for a complete comparison of HTTP status codes.

---

### 15. How will you push your code from local to a repository in Git?

**Step-by-step workflow:**

```bash
# 1. Check current status — see modified/new/deleted files
git status

# 2. Stage specific files or all changes
git add <filename>           # Stage a specific file
git add .                    # Stage all changes

# 3. Commit with a meaningful message
git commit -m "Add login page automation tests"

# 4. Push to the remote repository
git push origin <branch-name>
git push origin main         # Push to main branch
git push origin feature/login-tests  # Push to a feature branch
```

**First-time setup (if repo doesn't exist remotely yet):**

```bash
# Initialize a local Git repository
git init

# Add remote repository URL
git remote add origin https://github.com/username/repo-name.git

# Push for the first time (set upstream tracking)
git push -u origin main
```

**Complete workflow with branching (real-world):**

```bash
# 1. Pull latest changes from remote
git pull origin main

# 2. Create and switch to a feature branch
git checkout -b feature/add-cart-tests

# 3. Make changes, then stage and commit
git add .
git commit -m "Add cart functionality test cases"

# 4. Push the feature branch
git push origin feature/add-cart-tests

# 5. Create a Pull Request (PR) on GitHub/Azure DevOps for code review

# 6. After PR is approved and merged, clean up
git checkout main
git pull origin main
git branch -d feature/add-cart-tests
```

---

### 16. Can you modify the program so that it gets the input from the user?

**Modified version of Question 11 with user input via `Scanner`:**

```java
import java.util.Scanner;

public class ReverseWordsUserInput {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter a string: ");
        String input = scanner.nextLine();

        String[] words = input.split(" ");
        StringBuilder result = new StringBuilder();

        for (int i = 0; i < words.length; i++) {
            StringBuilder word = new StringBuilder(words[i]);
            result.append(word.reverse());
            if (i < words.length - 1) {
                result.append(" ");
            }
        }

        System.out.println("Reversed: " + result.toString());
        scanner.close();
    }
}
```

**Sample run:**
```
Enter a string: Pune Delhi Mumbai
Reversed: enuP ihleD iabmuM
```

**Key point:** Use `scanner.nextLine()` (not `scanner.next()`) to capture the full line including spaces. Always close the `Scanner` to avoid resource leaks.

---

### 17. What is the difference between the different HTTP status codes?

| Code Range | Category | Meaning |
|-----------|----------|---------|
| **1xx** | Informational | Request received, server is continuing to process |
| **2xx** | Success | Request was successfully received, understood, and accepted |
| **3xx** | Redirection | Further action needed to complete the request |
| **4xx** | Client Error | Request contains bad syntax or cannot be fulfilled |
| **5xx** | Server Error | Server failed to fulfill a valid request |

**Most commonly encountered status codes:**

| Code | Name | Description |
|------|------|-------------|
| **200** | OK | Request succeeded — standard success response |
| **201** | Created | Resource successfully created (typically after POST) |
| **204** | No Content | Success, but no content to return (typically after DELETE) |
| **301** | Moved Permanently | Resource has been permanently moved to a new URL |
| **302** | Found (Redirect) | Temporary redirect to a different URL |
| **400** | Bad Request | Server cannot process due to client error (malformed syntax, invalid data) |
| **401** | Unauthorized | Authentication required — missing or invalid credentials |
| **403** | Forbidden | Server understood but refuses to authorize — you don't have permission |
| **404** | Not Found | Requested resource doesn't exist on the server |
| **405** | Method Not Allowed | HTTP method not supported for this endpoint (e.g., POST on a GET-only endpoint) |
| **409** | Conflict | Request conflicts with current state (e.g., duplicate entry) |
| **500** | Internal Server Error | Server encountered an unexpected error |
| **502** | Bad Gateway | Server received an invalid response from an upstream server |
| **503** | Service Unavailable | Server temporarily overloaded or under maintenance |
| **504** | Gateway Timeout | Upstream server didn't respond in time |

**Key distinction for testers:**
- **4xx = Client's fault** — fix the request (wrong URL, missing auth, bad payload)
- **5xx = Server's fault** — log a defect against the backend team

---

### 18. What can we use instead of an Array?

Java provides the **Collections Framework** as a more flexible alternative to arrays:

| Collection | Description | When to Use |
|-----------|-------------|-------------|
| **ArrayList** | Dynamic-size list, ordered, allows duplicates | Most common replacement — when you need a resizable array |
| **LinkedList** | Doubly-linked list, efficient insert/delete | Frequent insertions/deletions in the middle |
| **HashSet** | Unordered, no duplicates | When you need unique elements only |
| **LinkedHashSet** | Ordered (insertion order), no duplicates | Unique elements with predictable iteration order |
| **TreeSet** | Sorted order, no duplicates | When you need elements automatically sorted |
| **HashMap** | Key-value pairs, unordered | When you need to map keys to values |
| **LinkedHashMap** | Key-value pairs, insertion order preserved | Ordered key-value mappings |
| **TreeMap** | Key-value pairs, sorted by key | Sorted key-value mappings |

```java
// Array — fixed size, manual operations
int[] arr = new int[5];
arr[0] = 10;
// Can't add more than 5 elements!

// ArrayList — dynamic size, built-in methods
ArrayList<Integer> list = new ArrayList<>();
list.add(10);
list.add(20);
list.add(30);
list.remove(1);              // Remove element at index 1
boolean exists = list.contains(10); // true
int size = list.size();      // 2
Collections.sort(list);      // Sort in place

// HashSet — unique elements
HashSet<String> browsers = new HashSet<>();
browsers.add("Chrome");
browsers.add("Firefox");
browsers.add("Chrome");      // Ignored — duplicate
System.out.println(browsers.size()); // 2

// HashMap — key-value pairs
HashMap<String, String> config = new HashMap<>();
config.put("browser", "chrome");
config.put("env", "qa");
String browser = config.get("browser"); // "chrome"
```

**In Selenium/Automation context:** `ArrayList` is used extensively for storing lists of `WebElement`, test data, or dynamic test results. `HashMap`/`LinkedHashMap` for configuration and test data key-value pairs.

---

### 19. Do you know the BDD Cucumber framework?

**Sample Answer:**

"Yes, I have hands-on experience with the **BDD (Behavior-Driven Development) Cucumber framework** integrated with Selenium and Java.

**Key components:**

| Component | Description |
|-----------|-------------|
| **Feature File** (.feature) | Written in **Gherkin** syntax (Given-When-Then), describes test scenarios in plain English |
| **Step Definitions** | Java methods that map to each Gherkin step — contain the actual Selenium automation code |
| **Test Runner** | Configures Cucumber execution — specifies feature file location, step definitions path, report format |
| **Hooks** | `@Before` and `@After` methods for setup/teardown (similar to TestNG annotations) |

```gherkin
# login.feature
Feature: Login Functionality
  As a registered user
  I want to log into the application
  So that I can access my account

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter username "admin" and password "Test@123"
    And I click the login button
    Then I should see the dashboard page

  Scenario Outline: Login with multiple credentials
    Given I am on the login page
    When I enter username "<username>" and password "<password>"
    And I click the login button
    Then I should see "<message>"

    Examples:
      | username | password  | message          |
      | admin    | Test@123  | Welcome, admin   |
      | invalid  | wrong     | Invalid login    |
```

```java
// Step Definitions
public class LoginSteps {
    WebDriver driver;
    LoginPage loginPage;

    @Given("I am on the login page")
    public void navigateToLogin() {
        driver = new ChromeDriver();
        driver.get("https://example.com/login");
        loginPage = new LoginPage(driver);
    }

    @When("I enter username {string} and password {string}")
    public void enterCredentials(String username, String password) {
        loginPage.enterUsername(username);
        loginPage.enterPassword(password);
    }

    @And("I click the login button")
    public void clickLogin() {
        loginPage.clickLogin();
    }

    @Then("I should see the dashboard page")
    public void verifyDashboard() {
        Assert.assertTrue(driver.getTitle().contains("Dashboard"));
    }
}
```

```java
// Test Runner
@RunWith(Cucumber.class)
@CucumberOptions(
    features = "src/test/resources/features",
    glue = "stepdefinitions",
    plugin = {"pretty", "html:target/cucumber-reports.html"},
    monochrome = true
)
public class TestRunner { }
```

**Advantages of BDD Cucumber:**
- Bridges the gap between **business stakeholders and technical team** — feature files are readable by non-technical people
- Serves as **living documentation** for the application
- Enables **reusable step definitions** across multiple scenarios
- Supports **data-driven testing** via `Scenario Outline` with `Examples` table"

---

### 20. Can you write an SQL query to get the item names whose value is greater than or equal to 400?

```sql
-- Basic query
SELECT item_name
FROM items
WHERE value >= 400;

-- With additional useful columns
SELECT item_name, value
FROM items
WHERE value >= 400
ORDER BY value DESC;

-- If the table name is 'products' with columns 'product_name' and 'price'
SELECT product_name, price
FROM products
WHERE price >= 400
ORDER BY price ASC;
```

**Key points:**
- `>=` is the "greater than or equal to" comparison operator in SQL
- Always use `ORDER BY` in interviews to show awareness of result ordering
- Use `ASC` (ascending, default) or `DESC` (descending) for sort direction

---

### 21. Can you make an abstract method static in Java?

**No, an abstract method cannot be static in Java.**

**Reasons:**
- **Abstract methods** are meant to be **overridden** by subclasses — they define a contract that subclasses must implement
- **Static methods** belong to the **class itself**, not to instances — they are resolved at **compile time** (static binding), not runtime
- Overriding relies on **runtime polymorphism** (dynamic dispatch), which only works with instance methods
- Making an abstract method static is contradictory: you're saying "subclass must implement this" while also saying "this belongs to the class, not instances"

```java
// ❌ This will NOT compile
abstract class Animal {
    abstract static void sound(); // Compilation error: illegal combination of modifiers
}

// ✅ Correct — abstract methods must be instance methods
abstract class Animal {
    abstract void sound(); // Subclass MUST override this
}

class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Bark");
    }
}

// ✅ Static methods in abstract classes are allowed (but they can't be abstract)
abstract class Animal {
    static void breathe() {
        System.out.println("All animals breathe"); // Concrete static method — OK
    }
    abstract void sound(); // Abstract instance method — OK
}
```

**Summary:** An abstract class **can have** static methods, but those static methods must have a **body** (they can't be abstract).

---

### 22. How have you used AI tools in your work?

**Sample Answer:**

"I've integrated AI tools into various stages of my QA workflow:

**1. Test Case Design & Planning:**
- Used **ChatGPT/Gemini** to brainstorm edge cases and negative test scenarios for complex features
- Generated test case templates from requirement documents

**2. Code Generation & Productivity:**
- **GitHub Copilot** for auto-completing Selenium Page Object methods, assertions, and boilerplate code
- Generated utility methods (wait helpers, screenshot utils) with AI assistance, then reviewed and customized

**3. Debugging & Root Cause Analysis:**
- Pasted stack traces and error logs into AI tools to quickly understand and diagnose test failures
- Used AI to explain unfamiliar exceptions and suggest fixes

**4. Documentation:**
- Generated Javadoc comments and README documentation for the automation framework
- Created test summary reports from test results

**5. API Testing:**
- Used **Postman's Postbot** to auto-generate test scripts for API endpoints
- Generated mock API responses for testing

**Example — Practical time savings:**
- Writing a new Page Object class manually: ~30 minutes
- With AI assistance (Copilot + review): ~10 minutes
- That's a **66% time reduction** on repetitive coding tasks, freeing me to focus on test strategy and analysis

**My approach:** I treat AI as a **productivity accelerator**, not a replacement. Every AI-generated output goes through my review for correctness, relevance, and adherence to our framework conventions."

---

### 23. What repositories do we have in Maven?

Maven uses three types of repositories to manage dependencies:

| Repository | Location | Description |
|-----------|----------|-------------|
| **Local Repository** | `~/.m2/repository` (user's machine) | Cache of all downloaded dependencies. Maven checks here first before going remote. |
| **Central Repository** | `https://repo.maven.apache.org/maven2` | Default public repository maintained by the Maven community. Contains most open-source libraries. |
| **Remote Repository** | Organization-specific URL | Private/custom repositories hosted using tools like **Nexus**, **Artifactory**, or **AWS CodeArtifact**. Used for proprietary/internal libraries. |

**How Maven resolves dependencies:**

```
1. Check Local Repository (~/.m2/repository)
   ↓ (not found)
2. Check Central Repository (repo.maven.apache.org)
   ↓ (not found)
3. Check Remote/Private Repository (if configured in pom.xml)
   ↓ (found)
4. Download to Local Repository and use
```

**Configuring a remote repository in `pom.xml`:**

```xml
<repositories>
    <repository>
        <id>company-nexus</id>
        <name>Company Nexus Repository</name>
        <url>https://nexus.company.com/repository/maven-releases/</url>
    </repository>
</repositories>
```

**Key commands:**
```bash
mvn install          # Install artifact to local repository
mvn deploy           # Deploy artifact to remote repository
mvn dependency:tree  # View dependency tree
mvn clean install -U # Force update from remote repositories
```

---

### 24. Can you write an XPath to search for a product and get the title of the first product in the results?

```java
// Step 1: Locate the search box and search for a product
WebElement searchBox = driver.findElement(By.id("twotabsearchtextbox")); // Amazon search box
searchBox.sendKeys("Selenium book");
searchBox.sendKeys(Keys.ENTER);

// Step 2: Wait for results to load
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

// Step 3: XPath to get the title of the FIRST product in search results

// Option 1: Using the search result data-index attribute
WebElement firstProduct = wait.until(ExpectedConditions.visibilityOfElementLocated(
    By.xpath("(//div[@data-component-type='s-search-result'])[1]//h2/a/span")));

// Option 2: Using the result list structure
WebElement firstProduct2 = driver.findElement(
    By.xpath("(//div[contains(@class,'s-result-item')]//h2//span)[1]"));

// Option 3: Using CSS Selector alternative
WebElement firstProduct3 = driver.findElement(
    By.cssSelector("div[data-component-type='s-search-result']:first-of-type h2 a span"));

String productTitle = firstProduct.getText();
System.out.println("First product title: " + productTitle);
```

**Key tips:**
- Use `(//xpath)[1]` to select only the first match from multiple results
- Always use `WebDriverWait` for search results — they load asynchronously
- Inspect the actual DOM structure in DevTools, as it varies across sites
- Prefer `data-*` attributes over class names for stability

---

### 25. Can you modify the SQL query to get the customer ID as well?

**Modified from Question 20 — adding customer ID:**

```sql
-- If items table has a customer_id column
SELECT customer_id, item_name, value
FROM items
WHERE value >= 400
ORDER BY customer_id, value DESC;

-- If customer info is in a separate table (using JOIN)
SELECT c.customer_id, c.customer_name, i.item_name, i.value
FROM items i
INNER JOIN customers c ON i.customer_id = c.customer_id
WHERE i.value >= 400
ORDER BY c.customer_id, i.value DESC;

-- With aggregate — total value per customer for items >= 400
SELECT c.customer_id, c.customer_name, COUNT(i.item_name) AS item_count, SUM(i.value) AS total_value
FROM items i
INNER JOIN customers c ON i.customer_id = c.customer_id
WHERE i.value >= 400
GROUP BY c.customer_id, c.customer_name
ORDER BY total_value DESC;
```

**Key point:** When the interviewer asks to "add customer ID," they're typically testing your knowledge of **JOINs** — the customer ID may come from a related table, requiring you to join on a foreign key.

---

### 26. A product has been launched to the customer, and the customer reports an issue. What steps would you take for this leaked defect?

**Step-by-step approach for handling a production/leaked defect:**

**1. Reproduce & Document (Immediate)**
- Get the **exact repro steps** from the customer (screenshots, videos, environment details)
- Reproduce the issue in the **production-like environment** or staging
- Log a detailed **bug report** with: steps to reproduce, expected vs actual, severity, priority, environment, screenshots/logs

**2. Severity Assessment & Triage**
- Classify severity: **Blocker** (system down), **Critical** (major feature broken), **Major**, **Minor**
- Determine the **blast radius** — how many users are affected?
- Escalate to the **development lead and project manager** immediately for critical/blocker issues

**3. Root Cause Analysis (RCA)**
- Investigate: Was this defect in an **untested area**? Was the **test case missing**? Did the test pass but the **condition wasn't covered**?
- Check if it's a **regression** caused by a recent code change
- Review server logs, application logs, and error traces

**4. Hotfix & Verification**
- Work with the development team on an **emergency hotfix**
- Perform **focused testing** on the fix in staging
- Conduct **regression testing** on related areas to ensure the fix doesn't break anything else
- Deploy the fix to production after sign-off

**5. Process Improvement (Post-mortem)**
- Add the **missed test case** to the regression suite
- Update the **test plan** to cover the gap
- Conduct a **Root Cause Analysis (RCA) meeting** with the team
- Implement preventive measures:
  - Add automated test for this scenario
  - Improve code review checklists
  - Enhance test coverage for similar areas

**6. Communication**
- Update the customer on the status, ETA for the fix, and workaround (if available)
- Document the incident in the **lessons learned** repository

---

### 27. Do you have any experience in ETL Testing?

**Sample Answer:**

"While my primary expertise is in UI and API automation testing, I have some exposure to ETL (Extract, Transform, Load) testing. Here's what I understand and have worked on:

**What is ETL Testing?**
ETL testing validates the data pipeline that extracts data from source systems, transforms it according to business rules, and loads it into target systems (data warehouses, data lakes).

**Types of ETL Testing:**

| Test Type | What It Validates |
|-----------|-------------------|
| **Data Completeness** | All expected records are loaded — source count = target count |
| **Data Transformation** | Business rules applied correctly (e.g., currency conversion, date formatting) |
| **Data Quality** | No duplicates, no null values in required fields, data integrity |
| **Data Accuracy** | Source data matches target data after transformation |
| **Performance** | ETL jobs complete within the expected SLA/time window |
| **Incremental Load** | Only new/changed records are processed in subsequent loads |

**SQL-based ETL validation example:**

```sql
-- Data completeness: Source vs Target row count
SELECT COUNT(*) AS source_count FROM source_db.orders;
SELECT COUNT(*) AS target_count FROM target_db.orders_fact;

-- Data accuracy: Compare key columns
SELECT s.order_id, s.amount, t.amount
FROM source_db.orders s
JOIN target_db.orders_fact t ON s.order_id = t.order_id
WHERE s.amount != t.amount;

-- Duplicate check in target
SELECT order_id, COUNT(*)
FROM target_db.orders_fact
GROUP BY order_id
HAVING COUNT(*) > 1;
```

**My exposure:** I've written SQL queries to validate data loads, checked row counts between source and target, and verified transformation rules as part of data migration projects."

---

### 28. Can you give an example of process improvement or optimization you have done to reduce manual effort?

**Sample Answer:**

"Here are two significant process improvements I've implemented:

**1. Automated Regression Suite (Biggest Impact)**

| Aspect | Before | After |
|--------|--------|-------|
| Execution | Manual regression: 3 testers × 2 days = 6 person-days per release | Automated: 300+ test cases run in 45 minutes via Jenkins |
| Frequency | Once per release (every 2 weeks) | Every build (daily, sometimes multiple times/day) |
| Coverage | ~150 test cases manually | 300+ automated + exploratory for new features |
| Cost savings | - | ~80% reduction in regression effort per sprint |

**How I did it:**
- Built a Selenium + TestNG + Maven framework from scratch using POM design pattern
- Prioritized automating the highest-ROI tests first (critical paths, frequently failing areas)
- Integrated with Jenkins for CI/CD — tests trigger automatically on every code merge
- Added Extent Reports for clear pass/fail dashboards accessible to the whole team

**2. Test Data Management Optimization**

| Aspect | Before | After |
|--------|--------|-------|
| Data creation | Manually created through UI before each test run (~1 hour setup) | API-based data creation using RestAssured — done in seconds |
| Data cleanup | Manual — often forgotten, causing test environment pollution | Automated teardown in `@AfterMethod` hooks |
| Data reusability | Hard-coded in tests | Externalized to Excel/JSON, easily modified without code changes |

**3. Reporting & Communication**
- Replaced manual test execution reports (Excel-based) with **automated Extent Reports** with screenshots on failure
- Reduced status reporting effort from 30 minutes/day to zero — stakeholders directly access the Jenkins dashboard

**Key takeaway:** The biggest ROI comes from automating **repetitive, time-consuming tasks** that are executed frequently. I always evaluate: *'If I automate this, how many hours will it save over the next 6 months?'*"

---

---

## 5. Licious — SDET Interview Questions

*Recent SDET interview questions from Licious. Covers REST Assured API automation, Selenium UI validation, XPath strategies, e-commerce testing scenarios (cart limits, inventory), SQL queries, and Java coding/optimization challenges.*

---

### 1. Write REST Assured code to do a PATCH update

A **PATCH** request is used to **partially update** an existing resource — unlike PUT, which replaces the entire resource, PATCH only modifies the specified fields.

```java
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;
import org.testng.annotations.Test;

public class PatchUpdateTest {

    @Test
    public void patchUpdateUser() {
        // Base URI setup
        RestAssured.baseURI = "https://reqres.in/api";

        // JSON body with only the fields to update (partial update)
        String patchBody = "{\"name\": \"Sriram Updated\", \"job\": \"Lead SDET\"}";

        // PATCH request
        Response response = given()
            .contentType(ContentType.JSON)
            .body(patchBody)
        .when()
            .patch("/users/2")
        .then()
            .statusCode(200)
            .body("name", equalTo("Sriram Updated"))
            .body("job", equalTo("Lead SDET"))
            .body("updatedAt", notNullValue())
            .log().all()
            .extract().response();

        // Additional assertions
        System.out.println("Updated At: " + response.jsonPath().getString("updatedAt"));
    }

    @Test
    public void patchWithMap() {
        // Using a Map for the request body (cleaner approach)
        java.util.Map<String, Object> patchData = new java.util.HashMap<>();
        patchData.put("name", "Sriram");
        // Only sending 'name' — 'job' and other fields remain unchanged

        given()
            .contentType(ContentType.JSON)
            .body(patchData)
        .when()
            .patch("https://reqres.in/api/users/2")
        .then()
            .statusCode(200)
            .body("name", equalTo("Sriram"));
    }

    @Test
    public void patchWithAuthentication() {
        // Real-world example with auth token
        String token = "Bearer eyJhbGciOiJIUzI1NiJ9...";

        String patchBody = "{\"status\": \"active\"}";

        given()
            .header("Authorization", token)
            .contentType(ContentType.JSON)
            .body(patchBody)
        .when()
            .patch("https://api.example.com/users/123")
        .then()
            .statusCode(200)
            .body("status", equalTo("active"));
    }
}
```

**PATCH vs PUT:**

| Aspect | PATCH | PUT |
|--------|-------|-----|
| Update type | **Partial** — only specified fields | **Full** — replaces entire resource |
| Request body | Contains only the fields to change | Must contain the complete resource |
| Idempotent | Not necessarily | Yes |
| Use case | Update a user's email only | Replace the entire user record |

---

### 2. On searching a product on Amazon search bar, the searched word is in light font and other words are in bold font. How will you validate this in automation?

Amazon's search suggestions display the **typed text in normal/light font** and the **auto-completed/suggested portion in bold font** (`<b>` tags or different CSS styling). To validate this, we need to check the HTML structure and CSS properties of the suggestion text.

```java
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.*;
import java.time.Duration;
import java.util.List;
import org.testng.Assert;
import org.testng.annotations.Test;

public class AmazonSearchFontValidation {

    @Test
    public void validateSearchSuggestionFonts() {
        WebDriver driver = new ChromeDriver();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        driver.get("https://www.amazon.in");

        // Type a search term
        String searchTerm = "selenium";
        WebElement searchBox = driver.findElement(By.id("twotabsearchtextbox"));
        searchBox.sendKeys(searchTerm);

        // Wait for suggestions to appear
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.cssSelector(".s-suggestion")));

        // Get all suggestion items
        List<WebElement> suggestions = driver.findElements(
            By.cssSelector(".s-suggestion"));

        for (WebElement suggestion : suggestions) {
            String fullText = suggestion.getText();
            System.out.println("Suggestion: " + fullText);

            // Method 1: Validate using HTML structure
            // Amazon wraps the BOLD (auto-completed) part in <b> or <span class="bold">
            String innerHTML = suggestion.getAttribute("innerHTML");
            System.out.println("Inner HTML: " + innerHTML);

            // The searched text should NOT be inside <b> tags (it's in light/normal font)
            // The suggested/auto-completed text IS inside <b> tags (bold font)

            // Method 2: Validate using CSS properties
            // Find the bold portion within the suggestion
            List<WebElement> boldParts = suggestion.findElements(By.tagName("b"));
            for (WebElement boldPart : boldParts) {
                String fontWeight = boldPart.getCssValue("font-weight");
                System.out.println("Bold part text: " + boldPart.getText());
                System.out.println("Font weight: " + fontWeight);

                // font-weight for bold is typically "700" or "bold"
                Assert.assertTrue(
                    fontWeight.equals("700") || fontWeight.equals("bold"),
                    "Auto-completed text should be bold");
            }

            // Method 3: Validate that the searched term portion has normal font weight
            // The non-bold (light) text is the user's typed input
            // We can check the parent span's font-weight
            List<WebElement> normalParts = suggestion.findElements(
                By.cssSelector("span:not(b):not(.s-heavy)"));
            for (WebElement normalPart : normalParts) {
                String fontWeight = normalPart.getCssValue("font-weight");
                // font-weight for normal is typically "400" or "normal"
                Assert.assertTrue(
                    fontWeight.equals("400") || fontWeight.equals("normal"),
                    "Searched term should be in light/normal font");
            }
        }

        driver.quit();
    }

    @Test
    public void validateUsingJavaScript() {
        WebDriver driver = new ChromeDriver();
        driver.get("https://www.amazon.in");

        WebElement searchBox = driver.findElement(By.id("twotabsearchtextbox"));
        searchBox.sendKeys("laptop");

        // Use JavaScript to get computed styles
        JavascriptExecutor js = (JavascriptExecutor) driver;

        WebElement suggestion = driver.findElement(By.cssSelector(".s-suggestion"));
        WebElement boldElement = suggestion.findElement(By.tagName("b"));

        // Get computed font-weight via JS
        String computedWeight = (String) js.executeScript(
            "return window.getComputedStyle(arguments[0]).fontWeight;", boldElement);

        System.out.println("Computed font-weight of bold part: " + computedWeight);
        Assert.assertEquals(computedWeight, "700", "Bold part should have font-weight 700");

        driver.quit();
    }
}
```

**Key validation approach:**
1. **HTML structure** — Check if the auto-completed text is wrapped in `<b>` or `<span class="bold">` tags
2. **CSS `font-weight`** — Normal text = `400`/`normal`, Bold text = `700`/`bold`
3. **`getCssValue("font-weight")`** — Selenium method to read CSS properties
4. **JavaScript `getComputedStyle()`** — Fallback for accurate computed styles

---

### 3. Create XPath that targets each suggestion when searching a product on Amazon search bar

```java
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.*;
import java.time.Duration;
import java.util.List;

public class AmazonSearchSuggestionXPaths {

    public void getSearchSuggestions(WebDriver driver) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        // Type search term
        WebElement searchBox = driver.findElement(By.id("twotabsearchtextbox"));
        searchBox.sendKeys("selenium");

        // Wait for the suggestion dropdown to appear
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("nav-flyout-searchAjax")));

        // ====== XPath strategies to target EACH suggestion ======

        // Option 1: Using the suggestion container class
        List<WebElement> suggestions1 = driver.findElements(
            By.xpath("//div[contains(@class, 's-suggestion')]" ));

        // Option 2: Using the autocomplete-results-container
        List<WebElement> suggestions2 = driver.findElements(
            By.xpath("//div[@id='nav-flyout-searchAjax']//div[contains(@class,'s-suggestion')]"));

        // Option 3: Using the suggestion role attribute
        List<WebElement> suggestions3 = driver.findElements(
            By.xpath("//div[@role='listbox']//div[@role='option']"));

        // Option 4: Target individual suggestion by index (Nth suggestion)
        // First suggestion
        WebElement firstSuggestion = driver.findElement(
            By.xpath("(//div[contains(@class, 's-suggestion')])[1]"));
        // Third suggestion
        WebElement thirdSuggestion = driver.findElement(
            By.xpath("(//div[contains(@class, 's-suggestion')])[3]"));

        // Option 5: Using data attributes
        List<WebElement> suggestions5 = driver.findElements(
            By.xpath("//div[@data-alias and contains(@class,'s-suggestion')]"));

        // Option 6: CSS Selector alternatives
        List<WebElement> suggestionsCSS = driver.findElements(
            By.cssSelector("div.s-suggestion"));

        // ====== Iterate and print all suggestions ======
        System.out.println("Total suggestions: " + suggestions1.size());
        for (int i = 0; i < suggestions1.size(); i++) {
            String text = suggestions1.get(i).getText();
            System.out.println("Suggestion " + (i + 1) + ": " + text);
        }

        // ====== Click a specific suggestion ======
        // Click suggestion containing specific text
        WebElement targetSuggestion = driver.findElement(
            By.xpath("//div[contains(@class,'s-suggestion') and contains(.,  'selenium java')]"));
        targetSuggestion.click();
    }

    // Dynamic XPath method — reusable for any search term
    public List<WebElement> getSuggestions(WebDriver driver, String searchTerm) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement searchBox = driver.findElement(By.id("twotabsearchtextbox"));
        searchBox.clear();
        searchBox.sendKeys(searchTerm);

        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.xpath("//div[contains(@class,'s-suggestion')]")));

        return driver.findElements(
            By.xpath("//div[contains(@class,'s-suggestion')]"));
    }
}
```

**Summary of XPath strategies:**

| Strategy | XPath | Use Case |
|----------|-------|-----------|
| All suggestions | `//div[contains(@class,'s-suggestion')]` | Get all suggestion items |
| Nth suggestion | `(//div[contains(@class,'s-suggestion')])[N]` | Target a specific suggestion by position |
| By text content | `//div[contains(@class,'s-suggestion') and contains(.,'text')]` | Find suggestion containing specific text |
| By role attribute | `//div[@role='option']` | Using ARIA role (more accessible/stable) |
| Within container | `//div[@id='nav-flyout-searchAjax']//div[contains(@class,'s-suggestion')]` | Scoped to the dropdown container |

---

### 4. If max cart value for a product is limited to 4, how will you test/validate in automation?

This is a **boundary value + business rule validation** scenario. You need to test at, below, and above the limit.

```java
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.*;
import java.time.Duration;
import org.testng.Assert;
import org.testng.annotations.Test;
import org.testng.annotations.DataProvider;

public class CartMaxLimitTest {

    private static final int MAX_CART_QUANTITY = 4;

    @Test(priority = 1)
    public void testAddWithinLimit() {
        // Add quantity within limit (1 to 4) — should succeed
        WebDriver driver = setupDriver();
        navigateToProduct(driver);

        // Select quantity = 3 (within limit)
        Select quantityDropdown = new Select(
            driver.findElement(By.id("quantity")));
        quantityDropdown.selectByValue("3");

        driver.findElement(By.id("add-to-cart-button")).click();

        // Verify product added successfully
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement confirmation = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("huc-v2-order-row-confirm-text")));
        Assert.assertTrue(confirmation.getText().contains("Added to Cart"));

        driver.quit();
    }

    @Test(priority = 2)
    public void testAddExactlyAtLimit() {
        // Boundary: Add exactly 4 (max limit) — should succeed
        WebDriver driver = setupDriver();
        navigateToProduct(driver);

        Select quantityDropdown = new Select(
            driver.findElement(By.id("quantity")));
        quantityDropdown.selectByValue(String.valueOf(MAX_CART_QUANTITY));

        driver.findElement(By.id("add-to-cart-button")).click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement confirmation = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("huc-v2-order-row-confirm-text")));
        Assert.assertTrue(confirmation.getText().contains("Added to Cart"));

        driver.quit();
    }

    @Test(priority = 3)
    public void testQuantityDropdownMaxOptions() {
        // Validate that the quantity dropdown does NOT show options > 4
        WebDriver driver = setupDriver();
        navigateToProduct(driver);

        Select quantityDropdown = new Select(
            driver.findElement(By.id("quantity")));
        List<WebElement> options = quantityDropdown.getOptions();

        int maxOptionValue = 0;
        for (WebElement option : options) {
            int val = Integer.parseInt(option.getAttribute("value"));
            if (val > maxOptionValue) maxOptionValue = val;
        }

        System.out.println("Max quantity in dropdown: " + maxOptionValue);
        Assert.assertEquals(maxOptionValue, MAX_CART_QUANTITY,
            "Dropdown should not allow more than " + MAX_CART_QUANTITY + " items");

        driver.quit();
    }

    @Test(priority = 4)
    public void testExceedLimitByMultipleAdds() {
        // Add 3 items, then try to add 2 more (total = 5, exceeds limit)
        WebDriver driver = setupDriver();
        navigateToProduct(driver);

        // First add: quantity = 3
        Select quantityDropdown = new Select(
            driver.findElement(By.id("quantity")));
        quantityDropdown.selectByValue("3");
        driver.findElement(By.id("add-to-cart-button")).click();

        // Navigate back to the same product
        navigateToProduct(driver);

        // Second add: quantity = 2 (total would be 5, exceeds limit of 4)
        quantityDropdown = new Select(
            driver.findElement(By.id("quantity")));
        quantityDropdown.selectByValue("2");
        driver.findElement(By.id("add-to-cart-button")).click();

        // Validate error/warning message appears
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement errorMsg = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//*[contains(text(),'limit') or contains(text(),'maximum')]")));
        Assert.assertTrue(errorMsg.isDisplayed(),
            "Error message should appear when exceeding cart limit");

        // Verify cart still has only 4 (adjusted to max, not 5)
        navigateToCart(driver);
        WebElement cartQuantity = driver.findElement(By.cssSelector(".sc-quantity-textfield"));
        Assert.assertTrue(
            Integer.parseInt(cartQuantity.getAttribute("value")) <= MAX_CART_QUANTITY,
            "Cart quantity should not exceed " + MAX_CART_QUANTITY);

        driver.quit();
    }

    @Test(priority = 5)
    public void testUpdateCartQuantityBeyondLimit() {
        // Add 1 item, go to cart, try manually changing quantity to 5
        WebDriver driver = setupDriver();
        navigateToProduct(driver);

        // Add 1 item
        driver.findElement(By.id("add-to-cart-button")).click();
        navigateToCart(driver);

        // Try to update quantity to 5 in the cart page
        WebElement quantityField = driver.findElement(By.cssSelector(".sc-quantity-textfield"));
        quantityField.clear();
        quantityField.sendKeys("5");
        quantityField.sendKeys(Keys.ENTER);

        // Verify error/warning or that quantity is capped at 4
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        try {
            WebElement errorMsg = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                    By.xpath("//*[contains(text(),'limit') or contains(text(),'exceed')]")));
            Assert.assertTrue(errorMsg.isDisplayed());
        } catch (TimeoutException e) {
            // If no error message, verify quantity was auto-corrected to 4
            String currentQty = quantityField.getAttribute("value");
            Assert.assertTrue(Integer.parseInt(currentQty) <= MAX_CART_QUANTITY,
                "Quantity should be auto-corrected to max limit");
        }

        driver.quit();
    }

    // Helper methods
    private WebDriver setupDriver() { /* driver setup */ return null; }
    private void navigateToProduct(WebDriver driver) { /* navigate to product page */ }
    private void navigateToCart(WebDriver driver) { /* navigate to cart page */ }
}
```

**Complete test scenarios for max cart limit = 4:**

| Test Case | Quantity | Expected Result |
|-----------|----------|-----------------|
| Below limit | 1, 2, 3 | ✅ Added successfully |
| At limit (boundary) | 4 | ✅ Added successfully |
| Above limit (single add) | Dropdown shouldn't show 5+ | ✅ Max option = 4 |
| Cumulative exceed (3+2) | Total = 5 | ❌ Error message / auto-cap to 4 |
| Cart edit to exceed | Manually type 5 in cart | ❌ Error message / auto-cap to 4 |
| API bypass attempt | POST /cart with qty=10 | ❌ API should reject (validate via RestAssured) |
| Zero quantity | 0 | ❌ Should not be allowed |
| Negative quantity | -1 | ❌ Should not be allowed |

---

### 5. If inventory stock available is just 2, how will you handle those scenarios of adding product to cart in your automation?

When inventory is limited, automation must handle **dynamic stock-dependent behavior** gracefully.

```java
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.*;
import java.time.Duration;
import java.util.List;
import org.testng.Assert;
import org.testng.annotations.Test;

public class LowInventoryCartTest {

    @Test
    public void testAddWithinAvailableStock() {
        WebDriver driver = setupDriver();
        navigateToProduct(driver);

        int availableStock = getAvailableStock(driver);
        System.out.println("Available stock: " + availableStock);

        if (availableStock >= 1) {
            // Add 1 item (within stock)
            Select qty = new Select(driver.findElement(By.id("quantity")));
            qty.selectByValue("1");
            driver.findElement(By.id("add-to-cart-button")).click();

            // Verify success
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement confirmation = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                    By.id("huc-v2-order-row-confirm-text")));
            Assert.assertTrue(confirmation.getText().contains("Added to Cart"));
        }
        driver.quit();
    }

    @Test
    public void testAddExactlyAtStockLimit() {
        // Boundary: add all available stock (2)
        WebDriver driver = setupDriver();
        navigateToProduct(driver);

        int availableStock = getAvailableStock(driver);

        Select qty = new Select(driver.findElement(By.id("quantity")));
        qty.selectByValue(String.valueOf(availableStock));
        driver.findElement(By.id("add-to-cart-button")).click();

        // Verify success
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement confirmation = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.id("huc-v2-order-row-confirm-text")));
        Assert.assertTrue(confirmation.getText().contains("Added to Cart"));

        driver.quit();
    }

    @Test
    public void testDropdownReflectsStockLimit() {
        // Verify dropdown only shows quantities up to available stock
        WebDriver driver = setupDriver();
        navigateToProduct(driver);

        Select qty = new Select(driver.findElement(By.id("quantity")));
        List<WebElement> options = qty.getOptions();

        int maxOption = 0;
        for (WebElement option : options) {
            int val = Integer.parseInt(option.getAttribute("value"));
            if (val > maxOption) maxOption = val;
        }

        int availableStock = getAvailableStock(driver);
        System.out.println("Max dropdown option: " + maxOption);
        System.out.println("Available stock: " + availableStock);

        Assert.assertTrue(maxOption <= availableStock,
            "Dropdown max should not exceed available stock");

        driver.quit();
    }

    @Test
    public void testAddMoreThanStockViaMultipleAdds() {
        // Add 2 items (full stock), then try adding 1 more
        WebDriver driver = setupDriver();
        navigateToProduct(driver);

        // First add: all available stock
        Select qty = new Select(driver.findElement(By.id("quantity")));
        qty.selectByValue("2");
        driver.findElement(By.id("add-to-cart-button")).click();

        // Navigate back and try to add 1 more
        navigateToProduct(driver);

        // Check if "Add to Cart" button is still available
        List<WebElement> addButtons = driver.findElements(By.id("add-to-cart-button"));
        if (addButtons.isEmpty() || !addButtons.get(0).isEnabled()) {
            System.out.println("Add to Cart button is disabled — stock exhausted");
            // Verify "Out of Stock" or similar message
            WebElement stockMsg = driver.findElement(
                By.xpath("//*[contains(text(),'out of stock') or contains(text(),'unavailable')]"));
            Assert.assertTrue(stockMsg.isDisplayed());
        } else {
            // Button exists — try adding, expect an error
            qty = new Select(driver.findElement(By.id("quantity")));
            qty.selectByValue("1");
            addButtons.get(0).click();

            // Verify error message about exceeding stock
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
            WebElement errorMsg = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                    By.xpath("//*[contains(text(),'stock') or contains(text(),'available')]")));
            Assert.assertTrue(errorMsg.isDisplayed());
        }

        driver.quit();
    }

    @Test
    public void testOutOfStockScenario() {
        // When stock = 0
        WebDriver driver = setupDriver();
        navigateToProduct(driver);

        int stock = getAvailableStock(driver);

        if (stock == 0) {
            // Verify "Add to Cart" button is disabled or replaced with "Out of Stock"
            List<WebElement> addButtons = driver.findElements(By.id("add-to-cart-button"));

            if (!addButtons.isEmpty()) {
                Assert.assertFalse(addButtons.get(0).isEnabled(),
                    "Add to Cart should be disabled when out of stock");
            }

            // Verify out-of-stock message is displayed
            WebElement outOfStockMsg = driver.findElement(
                By.xpath("//*[contains(text(),'Currently unavailable') or contains(text(),'Out of Stock')]"));
            Assert.assertTrue(outOfStockMsg.isDisplayed());
        }

        driver.quit();
    }

    @Test
    public void testStockValidationViaAPI() {
        // Validate stock at API level using RestAssured
        io.restassured.response.Response response = io.restassured.RestAssured
            .given()
                .header("Authorization", "Bearer " + getToken())
            .when()
                .post("/cart/add?productId=123&quantity=3") // stock is 2
            .then()
                .statusCode(400) // or 422
                .extract().response();

        String errorMessage = response.jsonPath().getString("message");
        Assert.assertTrue(errorMessage.contains("stock") || errorMessage.contains("available"),
            "API should return stock-related error");
    }

    // Helper: Dynamically get available stock from the product page
    private int getAvailableStock(WebDriver driver) {
        try {
            WebElement stockInfo = driver.findElement(
                By.xpath("//*[contains(text(),'Only') and contains(text(),'left in stock')]"));
            String text = stockInfo.getText(); // e.g., "Only 2 left in stock."
            return Integer.parseInt(text.replaceAll("[^0-9]", ""));
        } catch (NoSuchElementException e) {
            // If no "Only X left" message, assume stock is sufficient
            return 10;
        }
    }

    private WebDriver setupDriver() { return null; }
    private void navigateToProduct(WebDriver driver) { }
    private String getToken() { return ""; }
}
```

**Key scenarios for low inventory (stock = 2):**

| Scenario | Action | Expected |
|----------|--------|-----------|
| Add 1 item | Add qty=1 | ✅ Success |
| Add 2 items (boundary) | Add qty=2 | ✅ Success |
| Add 3 items (exceed) | Add qty=3 | ❌ Error / qty auto-adjusted |
| Sequential adds (2+1) | Add 2, then add 1 more | ❌ Second add fails / shows stock limit |
| Stock = 0 | Page shows out of stock | ❌ "Add to Cart" disabled |
| Dynamic stock reading | Read stock count before asserting | ✅ Makes tests resilient to stock changes |
| API-level validation | POST /cart/add with qty > stock | ❌ 400/422 error response |

**Best practice:** Always **read the available stock dynamically** from the product page before making assertions, rather than hard-coding stock values — stock changes in real environments.

---

### 6. SQL query to find average salary

```sql
-- Average salary of all employees
SELECT AVG(salary) AS average_salary
FROM employees;

-- Average salary rounded to 2 decimal places
SELECT ROUND(AVG(salary), 2) AS average_salary
FROM employees;

-- Average salary per department
SELECT department_id, department_name, ROUND(AVG(salary), 2) AS avg_salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
GROUP BY department_id, department_name
ORDER BY avg_salary DESC;

-- Average salary per department, only departments with avg > 50000
SELECT department_name, ROUND(AVG(salary), 2) AS avg_salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
GROUP BY department_name
HAVING AVG(salary) > 50000
ORDER BY avg_salary DESC;

-- Average salary by job title
SELECT job_title, ROUND(AVG(salary), 2) AS avg_salary, COUNT(*) AS employee_count
FROM employees
GROUP BY job_title
ORDER BY avg_salary DESC;

-- Employees earning more than the average salary
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
ORDER BY salary DESC;
```

**Key SQL concepts tested:**
- `AVG()` — aggregate function for calculating average
- `ROUND()` — formatting decimal results
- `GROUP BY` — average per category (department, role)
- `HAVING` — filter on aggregate results (unlike `WHERE` which filters rows)
- Subquery — comparing individual values against the aggregate

---

### 7. SQL query to find the products purchased by each employee (JOIN query)

```sql
-- Basic JOIN: products purchased by each employee
SELECT 
    e.employee_id,
    e.employee_name,
    p.product_name,
    o.quantity,
    o.order_date
FROM employees e
INNER JOIN orders o ON e.employee_id = o.employee_id
INNER JOIN products p ON o.product_id = p.product_id
ORDER BY e.employee_name, o.order_date;

-- Count of products purchased per employee
SELECT 
    e.employee_id,
    e.employee_name,
    COUNT(DISTINCT p.product_id) AS total_products,
    SUM(o.quantity) AS total_quantity
FROM employees e
INNER JOIN orders o ON e.employee_id = o.employee_id
INNER JOIN products p ON o.product_id = p.product_id
GROUP BY e.employee_id, e.employee_name
ORDER BY total_products DESC;

-- Include employees who haven't purchased anything (LEFT JOIN)
SELECT 
    e.employee_id,
    e.employee_name,
    COALESCE(p.product_name, 'No purchases') AS product_name,
    COALESCE(o.quantity, 0) AS quantity
FROM employees e
LEFT JOIN orders o ON e.employee_id = o.employee_id
LEFT JOIN products p ON o.product_id = p.product_id
ORDER BY e.employee_name;

-- Products purchased per employee as comma-separated list
SELECT 
    e.employee_name,
    GROUP_CONCAT(DISTINCT p.product_name ORDER BY p.product_name) AS products_purchased
FROM employees e
INNER JOIN orders o ON e.employee_id = o.employee_id
INNER JOIN products p ON o.product_id = p.product_id
GROUP BY e.employee_name
ORDER BY e.employee_name;
-- Note: GROUP_CONCAT is MySQL; use STRING_AGG in PostgreSQL/SQL Server
```

**Table structure assumed:**

```
employees:  employee_id | employee_name | department
products:   product_id  | product_name  | price
orders:     order_id    | employee_id   | product_id | quantity | order_date
```

**Key concepts:**
- **INNER JOIN** — only employees who have purchased products
- **LEFT JOIN** — includes employees with zero purchases (shows NULL for product columns)
- **COALESCE** — replaces NULL with a default value
- **GROUP_CONCAT / STRING_AGG** — aggregates multiple product names into one row per employee
- Multiple JOINs — chaining `employees → orders → products` through foreign keys

---

### 8. Code to print the character having the highest frequency in a string — optimized solution

**Optimized approach using a `HashMap` — O(n) time, O(1) space (bounded by character set size):**

```java
import java.util.HashMap;
import java.util.Map;

public class HighestFrequencyChar {

    public static void main(String[] args) {
        String input = "automation testing";
        System.out.println("Input: \"" + input + "\"");
        findHighestFrequency(input);
    }

    // Method 1: Using HashMap — O(n) time, O(k) space (k = unique chars)
    public static void findHighestFrequency(String input) {
        if (input == null || input.isEmpty()) {
            System.out.println("Empty or null string");
            return;
        }

        Map<Character, Integer> freqMap = new HashMap<>();
        char maxChar = input.charAt(0);
        int maxCount = 0;

        // Single pass: build frequency map and track max simultaneously
        for (char c : input.toCharArray()) {
            if (c == ' ') continue; // skip spaces
            int count = freqMap.getOrDefault(c, 0) + 1;
            freqMap.put(c, count);

            if (count > maxCount) {
                maxCount = count;
                maxChar = c;
            }
        }

        System.out.println("Character with highest frequency: '" + maxChar + "' (count: " + maxCount + ")");
        System.out.println("All frequencies: " + freqMap);
    }

    // Method 2: Using int array — O(n) time, O(1) space (fixed 256 ASCII chars)
    // MORE OPTIMIZED — avoids HashMap overhead
    public static char findHighestFrequencyOptimized(String input) {
        int[] freq = new int[256]; // ASCII character set
        char maxChar = ' ';
        int maxCount = 0;

        for (char c : input.toCharArray()) {
            if (c == ' ') continue;
            freq[c]++;
            if (freq[c] > maxCount) {
                maxCount = freq[c];
                maxChar = c;
            }
        }

        System.out.println("'" + maxChar + "' appears " + maxCount + " times");
        return maxChar;
    }

    // Method 3: Using Java Streams (concise, but slightly less performant)
    public static char findHighestFrequencyStream(String input) {
        return input.chars()
            .filter(c -> c != ' ')
            .mapToObj(c -> (char) c)
            .collect(java.util.stream.Collectors.groupingBy(
                c -> c, java.util.stream.Collectors.counting()))
            .entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElseThrow();
    }
}
```

**Output:**
```
Input: "automation testing"
Character with highest frequency: 't' (count: 3)
All frequencies: {a=2, u=1, t=3, o=2, m=1, i=2, n=2, e=1, s=1, g=1}
```

**Why int array (Method 2) is the most optimized:**

| Approach | Time | Space | Why |
|----------|------|-------|-----|
| HashMap | O(n) | O(k) — k unique chars | HashMap has boxing overhead for `Integer` |
| int[256] array | O(n) | O(1) — fixed 256 slots | Direct indexing, no hashing, no boxing, cache-friendly |
| Streams | O(n) | O(k) | Clean code but highest overhead (boxing, lambda, collectors) |

---

### 9. Optimized code for Precision-Orders validation scenario

**Problem:**
- `Precision` map gives the allowed decimal places for each product key
- `Orders` list has actual order values
- For each order, check if its decimal places are within the precision limit
- If decimal places ≤ precision → **accepted**, else → **rejected**

```
Precision: [{'acdf': 2}, {'ghjh': 4}, {'acvc': 3}]
Orders: [{'acdf': 1.5}, {'acdf': 2.456}, {'ghjh': 2.66}, {'acvc': 3.456}]

Expected Output:
acdf is accepted      (1.5 has 1 decimal place, precision allows 2 → ✅)
acdf is rejected      (2.456 has 3 decimal places, precision allows 2 → ❌)
ghjh is accepted      (2.66 has 2 decimal places, precision allows 4 → ✅)
acvc is accepted      (3.456 has 3 decimal places, precision allows 3 → ✅)
```

```java
import java.util.*;

public class PrecisionValidator {

    public static void main(String[] args) {

        // Step 1: Build the precision map
        Map<String, Integer> precisionMap = new HashMap<>();
        precisionMap.put("acdf", 2);
        precisionMap.put("ghjh", 4);
        precisionMap.put("acvc", 3);

        // Step 2: Build the orders list (each order is a key-value pair)
        List<Map.Entry<String, Double>> orders = new ArrayList<>();
        orders.add(Map.entry("acdf", 1.5));
        orders.add(Map.entry("acdf", 2.456));
        orders.add(Map.entry("ghjh", 2.66));
        orders.add(Map.entry("acvc", 3.456));

        // Step 3: Validate each order against its precision
        for (Map.Entry<String, Double> order : orders) {
            String key = order.getKey();
            double value = order.getValue();
            int allowedPrecision = precisionMap.getOrDefault(key, 0);
            int actualDecimalPlaces = getDecimalPlaces(value);

            if (actualDecimalPlaces <= allowedPrecision) {
                System.out.println(key + " is accepted");
            } else {
                System.out.println(key + " is rejected");
            }
        }
    }

    /**
     * Optimized method to count decimal places of a double value.
     * Converts to String to avoid floating-point precision issues.
     */
    private static int getDecimalPlaces(double value) {
        String text = String.valueOf(value);
        int dotIndex = text.indexOf('.');
        if (dotIndex < 0) return 0; // no decimal point

        // Remove trailing zeros for accurate count
        String decimalPart = text.substring(dotIndex + 1);
        // Trim trailing zeros: 1.50 → 1 decimal place, not 2
        decimalPart = decimalPart.replaceAll("0+$", "");
        return decimalPart.isEmpty() ? 0 : decimalPart.length();
    }
}
```

**Output:**
```
acdf is accepted
acdf is rejected
ghjh is accepted
acvc is accepted
```

**Walkthrough:**

| Order | Value | Actual Decimals | Allowed Precision | Result |
|-------|-------|-----------------|-------------------|--------|
| acdf | 1.5 | 1 | 2 | ✅ accepted (1 ≤ 2) |
| acdf | 2.456 | 3 | 2 | ❌ rejected (3 > 2) |
| ghjh | 2.66 | 2 | 4 | ✅ accepted (2 ≤ 4) |
| acvc | 3.456 | 3 | 3 | ✅ accepted (3 ≤ 3) |

**Why this solution is optimized:**
- **O(n) time** — single pass through orders, HashMap lookup is O(1)
- **O(k) space** — only the precision map (k = number of product keys)
- **String-based decimal counting** avoids floating-point arithmetic errors (e.g., `2.456 * 1000` might not give exactly `2456` due to IEEE 754)
- **Trailing zero handling** — `1.50` correctly evaluates to 1 decimal place, not 2

**Alternative: Using BigDecimal for precision-critical applications:**

```java
import java.math.BigDecimal;

private static int getDecimalPlacesBigDecimal(double value) {
    BigDecimal bd = BigDecimal.valueOf(value).stripTrailingZeros();
    return Math.max(0, bd.scale());
}
```

---

## 6. Oracle — QA Interview Questions (4+ Years Experience)

*Recent Oracle QA interview questions for a QA role, 4+ years experience. Covers Selenium 4 fundamentals, WebDriver interface design, OOP (class vs interface), framework/POM structure, Java coding + debugging, API POJOs, Jenkins pipelines, Linux, and SQL.*

---

### 1. Introduce yourself

**Sample Answer:**

"Hi, I'm [Your Name], a QA Automation Engineer with 4+ years of experience in Selenium WebDriver with Java, working across UI and API automation. I currently work at [Company] where I maintain and extend the automation framework for our web application.

**Day-to-day:**
- Designing and maintaining a Selenium + Java framework built on the Page Object Model
- Writing functional, regression, and API test suites (RestAssured)
- Integrating tests into Jenkins CI/CD pipelines with TestNG
- Collaborating with developers on defect triage and root-cause analysis

**Tech stack:** Selenium WebDriver, Java, TestNG, Maven, RestAssured, Jenkins, Git, SQL."

**Tips:**
- Keep it under 90 seconds: Intro → current role → tech stack → one achievement
- Tailor the achievement to the role you're interviewing for (framework ownership for a senior role, execution/coverage for a mid-level role)

---

### 2. Write a test case for the scenario where the search button on Amazon was not working, and you raised an issue

```
Test Case ID: TC_AMZ_SEARCH_001
Title: Verify search functionality works when clicking the Search button
Precondition: User is on the Amazon homepage (https://www.amazon.in)
Test Data: Search term = "laptop"

Steps:
  1. Navigate to the Amazon homepage
  2. Enter "laptop" in the search text box
  3. Click the Search button (magnifying glass icon)
  4. Observe the page response

Expected Result: User is navigated to the search results page showing
  products matching "laptop"; page title/URL updates to reflect the search

Actual Result: Clicking the Search button does nothing — page does not
  navigate, no results are displayed, no error message shown

Status: FAIL

Priority: Critical (P1) — blocks the core product-discovery flow
Severity: Critical — a broad, revenue-impacting functionality is broken

Defect Summary (raised in JIRA):
  Title: Search button unresponsive on Amazon homepage
  Steps to Reproduce: (same as above)
  Environment: Chrome 126, Windows 11, https://www.amazon.in
  Expected vs Actual: (as above)
  Attachments: Screenshot + browser console log (check for JS errors)
  Additional Notes: Confirmed reproducible across 3 attempts and in
    Incognito mode (rules out cache/extension interference); pressing
    Enter key after typing does navigate correctly, so the issue is
    isolated to the click handler on the Search button specifically
```

**Key point in the answer:** A good bug-report test case doesn't just say "button doesn't work" — it isolates the failure (click vs. Enter key both tested), states environment/reproducibility, and assigns priority/severity so triage doesn't need to ask follow-up questions.

---

### 3. Write complete steps for navigating to Google in Selenium 4

```java
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import java.time.Duration;

public class NavigateToGoogle {
    public static void main(String[] args) {

        // Selenium 4 auto-manages the driver binary — no need for
        // System.setProperty("webdriver.chrome.driver", ...) with
        // Selenium Manager (bundled since Selenium 4.6+)
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");

        // 1. Instantiate the WebDriver (ChromeDriver implements WebDriver)
        WebDriver driver = new ChromeDriver(options);

        try {
            // 2. Set implicit/page load timeouts (Selenium 4 Duration API)
            driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));

            // 3. Navigate to the URL
            driver.get("https://www.google.com");
            // driver.navigate().to("https://www.google.com"); // equivalent alternative

            // 4. Verify navigation succeeded
            String title = driver.getTitle();
            System.out.println("Page title: " + title); // "Google"
            assert title.equals("Google");

        } finally {
            // 5. Always close/quit the browser session
            driver.quit();
        }
    }
}
```

**Key points expected in the answer:**
- Selenium 4's built-in **Selenium Manager** removes the need to manually download/set the driver executable path
- `driver.get()` vs `driver.navigate().to()` — functionally identical for a fresh navigation; `navigate()` additionally exposes `back()`, `forward()`, `refresh()`
- Always wrap browser lifecycle in `try/finally` (or a `@BeforeMethod`/`@AfterMethod` in a framework) so `driver.quit()` runs even if an assertion fails
- `driver.close()` closes the current tab only; `driver.quit()` ends the whole session and kills the driver process

---

### 4. What is WebDriver? Interface or class?

**`WebDriver` is an interface**, not a class.

```java
package org.openqa.selenium;

public interface WebDriver extends SearchContext {
    void get(String url);
    String getTitle();
    List<WebElement> findElements(By by);
    WebElement findElement(By by);
    void quit();
    // ...
}
```

- `WebDriver` defines the **contract** — the set of operations any browser automation implementation must support (`get`, `findElement`, `quit`, etc.)
- `ChromeDriver`, `FirefoxDriver`, `EdgeDriver`, `SafariDriver` are all **concrete classes that implement `WebDriver`**
- We *code to the interface*: `WebDriver driver = new ChromeDriver();` — this is why frameworks can swap browsers via config without changing test code (Dependency Inversion / Strategy pattern in action)

```java
WebDriver driver = new ChromeDriver();   // reference type: interface, object type: class
WebDriver driver2 = new FirefoxDriver();  // same reference type, different implementation
```

---

### 5. Can't we write `ChromeDriver()` instead of `WebDriver`, and why (not)?

**You technically can**, but it defeats the purpose of programming to an abstraction and breaks framework flexibility.

```java
// Works, but tightly coupled to Chrome
ChromeDriver driver = new ChromeDriver();
driver.get("https://example.com");

// Preferred — reference type is the interface
WebDriver driver = new ChromeDriver();
driver.get("https://example.com");
```

**Why `WebDriver driver = new ChromeDriver()` is preferred:**

1. **Abstraction / loose coupling** — the rest of your code (Page Objects, utility methods, `BasePage`) only depends on the `WebDriver` contract, not on `ChromeDriver`-specific behavior. Swapping browsers means changing one line in a `DriverFactory`, not every method signature across the framework.
2. **Cross-browser support** — a `DriverFactory` typically returns `WebDriver` and picks the concrete class based on config:

```java
public static WebDriver createDriver(String browser) {
    switch (browser.toLowerCase()) {
        case "chrome":  return new ChromeDriver();
        case "firefox": return new FirefoxDriver();
        case "edge":    return new EdgeDriver();
        default: throw new IllegalArgumentException("Unsupported browser: " + browser);
    }
    // Return type is WebDriver in ALL cases — callers never know/care which concrete class it is
}
```

3. **You'd lose this if methods took `ChromeDriver` as a parameter** — a method like `public void login(ChromeDriver driver)` can never be called with a `FirefoxDriver`, forcing duplicated methods per browser.
4. **`ChromeOptions`-specific methods** (e.g., `ChromeDriver`'s Chrome-DevTools-Protocol-specific APIs like `executeCdpCommand`) are the *only* legitimate reason to declare a variable as the concrete type — and even then, it's usually scoped to a small utility method, not spread across the framework.

**Interview-ready summary:** "We *can*, but we don't, because coding to the `WebDriver` interface gives us polymorphism — the same Page Object and test code works regardless of which browser driver is actually instantiated underneath."

---

### 6. Do you know the difference between class and interfaces?

| Aspect | Class | Interface |
|--------|-------|-----------|
| Purpose | Blueprint for objects — defines state + behavior | Contract — defines *what* must be implemented, not *how* |
| Method bodies | Has full method implementations | Traditionally abstract only (Java 8+ allows `default`/`static` methods with bodies) |
| Fields | Instance variables with any modifier | Fields are implicitly `public static final` (constants) |
| Instantiation | Can be instantiated directly (`new ClassName()`) | Cannot be instantiated directly — needs an implementing class |
| Inheritance | Single inheritance (`extends` one class) | A class can implement **multiple** interfaces |
| Constructors | Has constructors | No constructors |
| Access modifiers on members | Can be `private`, `protected`, `public`, package-private | Members are `public` by default (implicitly) |

```java
// Interface — the contract
interface Vehicle {
    void start();          // implicitly public abstract
    int MAX_SPEED = 200;   // implicitly public static final
}

// Class — the implementation
class Car implements Vehicle {
    @Override
    public void start() {
        System.out.println("Car starting...");
    }
}

// Multiple interface implementation — not possible with class inheritance
interface Electric { void charge(); }
class ElectricCar implements Vehicle, Electric {
    public void start() { System.out.println("Silent start"); }
    public void charge() { System.out.println("Charging..."); }
}
```

**In Selenium context:** `WebDriver` is an interface (the contract), `ChromeDriver`/`FirefoxDriver` are classes (the implementations) — this is the textbook example interviewers expect you to connect back to.

---

### 7. Why can't we write class logic in the interface instead of writing it in the class implementing it?

**Short answer:** Because an interface is meant to define **what** behavior must exist across all implementers, not **how** that behavior works for one specific case — and different implementing classes legitimately need different logic for the same method.

**Deeper reasoning:**

1. **Different implementations genuinely differ.** `WebDriver.get(String url)` behaves differently under the hood for `ChromeDriver` (talks to ChromeDriver.exe / Chrome DevTools Protocol) versus `FirefoxDriver` (talks to geckodriver / Marionette protocol). If the logic lived in the interface, every implementer would be forced into identical behavior, which isn't physically possible — a Chrome-specific automation call cannot drive Firefox.
2. **Interfaces (pre-Java 8) cannot hold state.** Logic almost always needs instance fields to operate on (a session ID, a socket connection, a config object) — interfaces can't declare instance fields, only `public static final` constants, so meaningful logic has nowhere to store/mutate state.
3. **Single inheritance of behavior would break down.** If interface methods carried full logic and a class implemented two interfaces with the *same* method signature but different bodies, Java would face the **diamond problem** — ambiguity about which implementation to inherit. Java sidesteps this by keeping interfaces contract-only (or requiring explicit override resolution for `default` methods).
4. **What Java 8+ `default` methods are actually for:** They allow interfaces to provide *optional, common fallback logic* (e.g., `Comparator.reversed()`, `Iterable.forEach()`) — but this is meant for shared utility behavior that every implementer can reasonably reuse *unmodified*, not for core behavior that legitimately varies per class. It's an exception for API evolution, not a way to turn interfaces into base classes.

```java
interface Shape {
    double area();  // no implementation — HOW to compute area differs per shape

    // default method — genuinely reusable, doesn't vary per implementer
    default void printArea() {
        System.out.println("Area: " + area());
    }
}

class Circle implements Shape {
    double radius;
    Circle(double r) { this.radius = r; }
    public double area() { return Math.PI * radius * radius; } // Circle-specific logic
}

class Rectangle implements Shape {
    double length, width;
    Rectangle(double l, double w) { this.length = l; this.width = w; }
    public double area() { return length * width; } // Rectangle-specific logic
}
```

**Interview-ready summary:** "The interface defines *that* every shape must be able to compute an area; only the implementing class knows *how*, because the formula genuinely differs. Putting the formula in the interface would either be wrong for every shape but one, or require the interface to hold shape-specific state, which interfaces aren't designed to do."

---

### 8. Login to Google and verify successful login — written per your project's framework (driver/browser calling, parent class extension, POM structure)

```java
// ===== BasePage.java — common reusable methods, extended by all Page Objects =====
public class BasePage {
    protected WebDriver driver;
    protected WebDriverWait wait;

    public BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    protected void waitAndClick(By locator) {
        wait.until(ExpectedConditions.elementToBeClickable(locator)).click();
    }

    protected void waitAndType(By locator, String text) {
        WebElement el = wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
        el.clear();
        el.sendKeys(text);
    }

    protected String getText(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator)).getText();
    }
}

// ===== GoogleLoginPage.java — Page Object extending BasePage =====
public class GoogleLoginPage extends BasePage {

    private final By emailField = By.id("identifierId");
    private final By nextButtonEmail = By.id("identifierNext");
    private final By passwordField = By.name("Passwd");
    private final By nextButtonPassword = By.id("passwordNext");
    private final By profileIcon = By.cssSelector("a[aria-label*='Google Account']");

    public GoogleLoginPage(WebDriver driver) {
        super(driver);
    }

    public void login(String email, String password) {
        waitAndType(emailField, email);
        waitAndClick(nextButtonEmail);

        waitAndType(passwordField, password);
        waitAndClick(nextButtonPassword);
    }

    public boolean isLoginSuccessful() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(profileIcon)).isDisplayed();
    }
}

// ===== BaseTest.java — driver init/teardown, extended by all test classes =====
public class BaseTest {
    protected WebDriver driver;

    @BeforeMethod
    public void setUp() {
        driver = DriverFactory.createDriver("chrome"); // ThreadLocal-backed factory
        driver.manage().window().maximize();
        driver.get("https://accounts.google.com/signin");
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}

// ===== GoogleLoginTest.java — Test class calling the Page Object =====
public class GoogleLoginTest extends BaseTest {

    @Test
    public void verifySuccessfulGoogleLogin() {
        GoogleLoginPage loginPage = new GoogleLoginPage(driver);
        loginPage.login("testuser@gmail.com", "SecurePassword123");

        Assert.assertTrue(loginPage.isLoginSuccessful(),
            "Login should succeed and land on the Google Account dashboard");
    }
}
```

**Design points to call out in the interview:**
- `BaseTest` owns driver lifecycle (`@BeforeMethod`/`@AfterMethod`) — test classes just extend it and never touch driver creation directly
- `BasePage` centralizes wait/click/type logic — every Page Object inherits it instead of duplicating `WebDriverWait` boilerplate
- `GoogleLoginPage` only exposes **behavior** (`login()`, `isLoginSuccessful()`) — locators stay private, keeping the test class free of `By` references (true POM encapsulation)
- `DriverFactory` uses `ThreadLocal<WebDriver>` internally so this same structure supports parallel execution safely

---

### 9. Java program to find the 2nd max element from an array (and debug it)

```java
public class SecondMaxFinder {

    public static int findSecondMax(int[] arr) {
        if (arr == null || arr.length < 2) {
            throw new IllegalArgumentException("Array must have at least 2 elements");
        }

        int max = Integer.MIN_VALUE;
        int secondMax = Integer.MIN_VALUE;

        for (int num : arr) {
            if (num > max) {
                secondMax = max;   // old max demotes to secondMax
                max = num;
            } else if (num > secondMax && num != max) {
                secondMax = num;
            }
        }

        if (secondMax == Integer.MIN_VALUE) {
            throw new IllegalStateException("No distinct second maximum found (all elements equal)");
        }
        return secondMax;
    }

    public static void main(String[] args) {
        int[] arr = {12, 45, 2, 41, 45, 7};
        System.out.println("Second max: " + findSecondMax(arr)); // 41
    }
}
```

**Common buggy first attempt (what the interviewer typically hands you to debug):**

```java
// BUGGY VERSION
public static int findSecondMaxBuggy(int[] arr) {
    int max = arr[0], secondMax = arr[1];
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        } else if (arr[i] > secondMax) {   // BUG: doesn't exclude duplicates of max
            secondMax = arr[i];
        }
    }
    return secondMax;
}
```

**Bugs to identify while "debugging":**
1. **Duplicate values of `max` get picked as `secondMax`.** For `{45, 45, 2}`, the buggy version returns `45` (wrong) instead of `2`, because the `else if` doesn't check `arr[i] != max`.
2. **`secondMax = arr[1]` before comparing** — if `arr[1] > arr[0]`, `max` and `secondMax` start in the wrong order, though the loop usually self-corrects; still fragile as an initial assumption.
3. **No handling for arrays smaller than length 2**, or arrays where all elements are equal — should throw/flag explicitly instead of silently returning a wrong value.
4. **Doesn't reset `secondMax` when a *new* max is found** — this is the critical fix in the correct version (`secondMax = max;` right before updating `max`), so the previous max correctly "falls down" into the second-max slot.

**Walkthrough of the fix on `{12, 45, 2, 41, 45, 7}`:**
| num | max before | secondMax before | max after | secondMax after |
|-----|-----------|-------------------|-----------|-------------------|
| 12  | MIN | MIN | 12 | MIN |
| 45  | 12  | MIN | 45 | 12 |
| 2   | 45  | 12  | 45 | 12 |
| 41  | 45  | 12  | 45 | 41 |
| 45  | 45  | 41  | 45 | 41 *(41 > secondMax but 45==max, skip)* |
| 7   | 45  | 41  | 45 | 41 |

Result: `secondMax = 41` ✅

---

### 10. Did you develop the framework for your project?

**Sample Answer (adapt honestly to your actual experience):**

> "Yes — I was one of the core contributors who built our Selenium + Java + TestNG framework from the ground up. I designed the `DriverFactory` with `ThreadLocal<WebDriver>` for parallel execution, set up the Page Object Model structure with a shared `BasePage`, integrated Apache POI for data-driven Excel test data, added a custom TestNG listener for screenshot-on-failure with Extent Reports, and wired the whole thing into a Jenkins pipeline with parameterized browser/environment execution.
>
> If I joined a project with an existing framework instead, I'd say: I onboarded onto an existing Selenium/TestNG framework and extended it — adding new Page Objects, contributing utility methods, and later took ownership of migrating some parts (e.g., moving from `Thread.sleep()` to explicit waits, or adding API-level setup with RestAssured to reduce UI-driven data setup)."

**Tip:** Be honest about your actual level of ownership (built from scratch vs. extended an existing one) — interviewers often follow up with "why did you choose X design?" and vague answers about a framework you didn't actually design will fall apart quickly under a design-decision follow-up.

---

### 11. POJO classes and how you send requests / extract responses in API automation

**POJO (Plain Old Java Object)** classes map JSON request/response structures to typed Java objects, avoiding brittle string-based JSON parsing and enabling type-safe serialization/deserialization (via Jackson/Gson, which RestAssured uses internally).

```java
// ===== Request POJO =====
public class CreateUserRequest {
    private String name;
    private String job;

    public CreateUserRequest() {} // no-arg constructor required for serialization

    public CreateUserRequest(String name, String job) {
        this.name = name;
        this.job = job;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getJob() { return job; }
    public void setJob(String job) { this.job = job; }
}

// ===== Response POJO =====
public class CreateUserResponse {
    private String id;
    private String name;
    private String job;
    private String createdAt;

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getJob() { return job; }
    public void setJob(String job) { this.job = job; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}

// ===== Sending request / extracting response using POJOs =====
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import static io.restassured.RestAssured.given;
import org.testng.Assert;
import org.testng.annotations.Test;

public class CreateUserApiTest {

    @Test
    public void createUserUsingPojo() {
        RestAssured.baseURI = "https://reqres.in/api";

        // Build request body as a POJO — RestAssured serializes it to JSON automatically
        CreateUserRequest requestBody = new CreateUserRequest("Sriram", "SDET");

        // Send request, deserialize response directly into a POJO
        CreateUserResponse response = given()
            .contentType(ContentType.JSON)
            .body(requestBody)
        .when()
            .post("/users")
        .then()
            .statusCode(201)
            .extract()
            .as(CreateUserResponse.class); // Jackson deserializes JSON -> POJO

        // Type-safe assertions — no manual JsonPath string parsing needed
        Assert.assertEquals(response.getName(), "Sriram");
        Assert.assertEquals(response.getJob(), "SDET");
        Assert.assertNotNull(response.getId());
    }
}
```

**Why POJOs over raw JsonPath/string parsing:**
- **Type safety** — compile-time errors instead of runtime `ClassCastException`/typos in JSON keys
- **Reusability** — the same `CreateUserRequest`/`CreateUserResponse` POJOs are reused across many test methods
- **Readability** — `response.getName()` is clearer than `response.jsonPath().getString("name")` scattered everywhere
- **Serialization control** — annotations like `@JsonProperty("user_name")` (Jackson) let the POJO field name differ from the JSON key when needed

```java
import com.fasterxml.jackson.annotation.JsonProperty;

public class UserResponse {
    @JsonProperty("user_name")  // maps JSON key "user_name" to Java field "userName"
    private String userName;
}
```

---

### 12. Do you know Jenkins? Can you build a pipeline?

**Yes.** A Jenkins pipeline defines the build/test/deploy stages as code, typically via a **Jenkinsfile** (Declarative or Scripted syntax).

```groovy
// Jenkinsfile — Declarative Pipeline
pipeline {
    agent any

    tools {
        maven 'Maven-3.9'
        jdk 'JDK-17'
    }

    parameters {
        choice(name: 'BROWSER', choices: ['chrome', 'firefox', 'edge'], description: 'Browser to run tests on')
        choice(name: 'ENV', choices: ['qa', 'staging'], description: 'Target environment')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/org/automation-framework.git'
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean compile'
            }
        }

        stage('Run Tests') {
            steps {
                sh "mvn test -Dbrowser=${params.BROWSER} -Denv=${params.ENV} -DsuiteXmlFile=testng.xml"
            }
        }

        stage('Publish Reports') {
            steps {
                publishHTML(target: [
                    reportDir: 'test-output/ExtentReport',
                    reportFiles: 'index.html',
                    reportName: 'Extent Report'
                ])
                junit '**/surefire-reports/*.xml'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'screenshots/**', allowEmptyArchive: true
        }
        failure {
            mail to: 'qa-team@company.com',
                 subject: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Check console output at ${env.BUILD_URL}"
        }
    }
}
```

**Key components to mention:**
- **`agent`** — where the pipeline runs (any available node, or a labeled specific one)
- **`parameters`** — makes the pipeline reusable across browsers/environments without editing the Jenkinsfile
- **`post`** block — always/failure/success hooks for reporting and notifications
- **Build triggers** — CRON schedule for nightly regression, or **Poll SCM** / **GitHub webhook** for CI-on-push

---

### 13. Can we use a script to create the Jenkins pipeline?

**Yes** — this is exactly what a **Jenkinsfile** is: pipeline-as-code, checked into source control alongside the automation framework, instead of manually clicking through Jenkins' UI job configuration.

**Two pipeline syntaxes:**

| Style | Description |
|-------|-------------|
| **Declarative** | Structured, opinionated syntax (`pipeline { stages { ... } }` as shown in Q12) — easier to read/maintain, recommended for most teams |
| **Scripted** | Full Groovy scripting flexibility (`node { stage('Build') { ... } }`) — more powerful/flexible but harder to read and maintain |

```groovy
// Scripted Pipeline example — same intent as Q12, written in Scripted syntax
node {
    stage('Checkout') {
        git branch: 'main', url: 'https://github.com/org/automation-framework.git'
    }
    stage('Build & Test') {
        try {
            sh 'mvn clean test -DsuiteXmlFile=testng.xml'
        } catch (Exception e) {
            currentBuild.result = 'FAILURE'
            throw e
        } finally {
            junit '**/surefire-reports/*.xml'
        }
    }
}
```

**Ways to "script" the pipeline creation itself:**
1. **Jenkinsfile in SCM** (`Pipeline script from SCM`) — Jenkins job config just points to the repo path of the Jenkinsfile; the actual pipeline logic lives entirely in version-controlled Groovy
2. **Job DSL plugin / Jenkins Configuration as Code (JCasC)** — go a level further and even generate the Jenkins **job/folder configuration itself** from a script/YAML, useful when managing dozens of jobs consistently across teams
3. **Shared Libraries** — common pipeline logic (e.g., a standard "run TestNG suite and publish Extent Report" stage) extracted into a Jenkins Shared Library and imported (`@Library('common-qa-lib') _`) across multiple Jenkinsfiles, avoiding duplication

**Why this matters:** Pipeline-as-code means the CI/CD process is versioned, reviewable via PR, and reproducible — exactly the same engineering discipline applied to the automation framework itself.

---

### 14. Do you know Linux? Write a Linux command to create a file.

**Yes.** Common ways to create a file in Linux:

```bash
# Method 1: touch — creates an empty file (or updates timestamp if it exists)
touch testresults.log

# Method 2: redirection — creates a file (empty or with content)
> testresults.log                      # empty file
echo "Test execution started" > testresults.log   # file with content (overwrites)
echo "Second line" >> testresults.log              # appends to existing file

# Method 3: using a text editor (creates on save)
vi testresults.log
nano testresults.log

# Method 4: cat with heredoc — create a file with multi-line content
cat <<EOF > config.properties
browser=chrome
environment=qa
baseUrl=https://example.com
EOF
```

**Other Linux commands commonly expected in a QA context:**

```bash
ls -la                     # list files with details
mkdir test-reports         # create a directory
cp report.html /backup/    # copy a file
mv old.log archive/        # move/rename a file
rm file.txt                # delete a file
grep "FAILED" test.log     # search for a pattern in a file
tail -f execution.log      # live-tail a running test's log output
chmod +x run-tests.sh      # make a script executable
ps -ef | grep java         # check running Java (test) processes
```

---

### 15 & 16. SQL: fetch 2nd and then 3rd largest salary, with employee name

**Sample table:**

| Emp ID | Emp Name | Salary |
|--------|----------|--------|
| 1 | Rajesh | 2000 |
| 2 | Akash | 3000 |
| 3 | Om | 4000 |
| 2 | Ak | 5000 |

*(Note: Emp ID `2` appears twice with different names/salaries — this duplicate is also the basis for Q17 below.)*

```sql
-- 2nd highest salary, with name — DENSE_RANK handles ties correctly
SELECT emp_name, salary
FROM (
    SELECT emp_name, salary,
           DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
) ranked
WHERE rnk = 2;
-- Result: Om | 4000

-- 3rd highest salary, with name
SELECT emp_name, salary
FROM (
    SELECT emp_name, salary,
           DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
) ranked
WHERE rnk = 3;
-- Result: Akash | 3000

-- Generalized version — fetch the Nth highest salary by changing one parameter
SELECT emp_name, salary
FROM (
    SELECT emp_name, salary,
           DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
) ranked
WHERE rnk = :N;   -- pass N = 2, 3, 4, ...

-- Alternative using LIMIT/OFFSET (MySQL/Postgres) — simpler but breaks on tied salaries
SELECT emp_name, salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;  -- 2nd highest (OFFSET 2 for 3rd highest)
```

**Why `DENSE_RANK()` is the preferred answer:** If two employees tie for the highest salary, `LIMIT/OFFSET` would either skip a distinct salary or return a duplicate, depending on `DISTINCT` usage — `DENSE_RANK()` correctly ranks tied salaries the same and moves cleanly to the next *distinct* rank, which is what "2nd highest" and "3rd highest" actually mean.

---

### 17. Fetch duplicate Emp ID records from the employee table

Using the sample table above, Emp ID `2` is duplicated (`Akash`/3000 and `Ak`/5000).

```sql
-- Method 1: GROUP BY + HAVING — find the duplicated IDs, then join back for full rows
SELECT e.*
FROM employees e
INNER JOIN (
    SELECT emp_id
    FROM employees
    GROUP BY emp_id
    HAVING COUNT(*) > 1
) dup ON e.emp_id = dup.emp_id;

-- Result:
-- 2 | Akash | 3000
-- 2 | Ak    | 5000

-- Method 2: Window function — flag duplicates without a self-join
SELECT emp_id, emp_name, salary
FROM (
    SELECT emp_id, emp_name, salary,
           COUNT(*) OVER (PARTITION BY emp_id) AS cnt
    FROM employees
) t
WHERE cnt > 1;

-- Method 3: EXISTS — find rows whose emp_id appears in more than one row
SELECT e1.*
FROM employees e1
WHERE EXISTS (
    SELECT 1
    FROM employees e2
    WHERE e2.emp_id = e1.emp_id
    AND e2.ctid <> e1.ctid   -- Postgres; use a surrogate row-id equivalent on other DBs
);
```

**Practical note:** Method 1 (`GROUP BY ... HAVING COUNT(*) > 1` joined back to the base table) is the most portable and commonly expected answer across MySQL/Postgres/Oracle SQL — it clearly separates "detect the duplicate key" from "fetch the full duplicate rows," which is easy to explain on a whiteboard.

---

## 7. HCLTech — QA Interview Questions

*Recent HCLTech QA interview questions across three rounds: Core Java + Automation fundamentals, Selenium/TestNG/CI-CD, and a client-facing round covering AI usage, execution, and reporting.*

---

## Round 1: Core Java & Automation

### 1. What OOPs concepts have you used in your automation framework?

**Answer:** All four pillars show up naturally in a well-designed Selenium/Java framework:

| OOP Concept | Where it's used in the framework |
|-------------|-----------------------------------|
| **Encapsulation** | Locators are `private`/`protected` fields inside Page Object classes; only public methods (`login()`, `searchProduct()`) are exposed — test classes never touch `By` locators directly |
| **Inheritance** | Every Page Object `extends BasePage` (common `waitAndClick`, `waitAndType`); every test class `extends BaseTest` (driver init/teardown) |
| **Polymorphism** | Method overloading (`waitFor(WebElement)` vs `waitFor(WebElement, int seconds)`); method overriding (`DashboardPage` overrides `BasePage.waitForPageLoad()` with dashboard-specific logic); `WebDriver driver = new ChromeDriver()` — runtime polymorphism via the `WebDriver` interface |
| **Abstraction** | `WebDriver` interface hides the actual browser automation mechanics; a `DriverFactory` abstracts away *which* browser is actually launched from the rest of the framework |

```java
// Encapsulation — locators hidden, behavior exposed
public class LoginPage extends BasePage {          // Inheritance
    private By usernameField = By.id("username");   // Encapsulated locator
    private By passwordField = By.id("password");

    public LoginPage(WebDriver driver) { super(driver); }

    public void login(String user, String pass) {    // Exposed behavior only
        waitAndType(usernameField, user);
        waitAndType(passwordField, pass);
    }
}

// Polymorphism — overloading
public class WaitUtils {
    public void waitFor(WebElement el) { /* default timeout */ }
    public void waitFor(WebElement el, int seconds) { /* custom timeout */ }
}

// Abstraction — WebDriver interface, ChromeDriver/FirefoxDriver hide the "how"
WebDriver driver = DriverFactory.createDriver("chrome");
```

---

### 2. Which Collections have you used in your framework? (List, ArrayList, HashMap, Set)

| Collection | Where I use it | Why |
|------------|-----------------|-----|
| **`List` / `ArrayList`** | `driver.findElements()` returns `List<WebElement>` — iterating over product cards, table rows, search suggestions | Ordered, allows duplicates, index-based access |
| **`HashMap`** | Storing test data as key-value pairs (`Map<String,String> testData`), mapping environment name → base URL, caching Page Object instances | Fast O(1) key lookup, no ordering needed |
| **`HashSet`** | De-duplicating a list of scraped values (e.g., verifying no duplicate product IDs on a listing page) | Automatically enforces uniqueness |
| **`LinkedHashMap`** | Test data/config where **insertion order matters** (e.g., a sequence of form fields to fill in order) | Combines HashMap's speed with predictable iteration order |

```java
// List/ArrayList — iterating web elements
List<WebElement> productCards = driver.findElements(By.className("product-card"));
for (WebElement card : productCards) {
    System.out.println(card.getText());
}

// HashMap — key-value test/config data
Map<String, String> envUrls = new HashMap<>();
envUrls.put("qa", "https://qa.myapp.com");
envUrls.put("staging", "https://staging.myapp.com");
String baseUrl = envUrls.get("qa");

// HashSet — uniqueness check
Set<String> productIds = new HashSet<>();
for (WebElement card : productCards) {
    String id = card.getAttribute("data-id");
    if (!productIds.add(id)) {
        System.out.println("Duplicate product ID found: " + id);
    }
}
```

---

### 3. Explain `this` and `super` keyword in Java

| Keyword | Refers to | Common uses |
|---------|-----------|-------------|
| **`this`** | The **current object instance** | Disambiguate a field from a same-named constructor/method parameter; call another constructor in the same class (`this(...)`); pass the current object as an argument |
| **`super`** | The **immediate parent class** | Call the parent class's constructor (`super(...)`); access a parent method/field that's been overridden/hidden |

```java
public class BasePage {
    protected WebDriver driver;

    public BasePage(WebDriver driver) {
        this.driver = driver;   // 'this.driver' (field) vs 'driver' (constructor param)
    }

    public void waitForPageLoad() {
        System.out.println("Generic page load wait");
    }
}

public class LoginPage extends BasePage {
    public LoginPage(WebDriver driver) {
        super(driver);          // Calls BasePage's constructor — MUST be the first statement
    }

    @Override
    public void waitForPageLoad() {
        super.waitForPageLoad();  // Reuse parent's logic first...
        System.out.println("Waiting for login form to render"); // ...then add subclass-specific logic
    }
}
```

**Key points:**
- `super(...)` (constructor call) must be the **first line** in a subclass constructor — Java inserts it implicitly if you don't
- `this()` and `super()` can never both appear in the same constructor (only one "first statement" is allowed)
- `super.methodName()` is the standard way to **extend** rather than fully replace inherited behavior

---

### 4. Write a Java program to find and print broken links and non-broken links

```java
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

public class BrokenLinkChecker {

    public static void main(String[] args) {
        WebDriver driver = new ChromeDriver();
        driver.get("https://example.com");

        // Collect all anchor tags on the page
        List<WebElement> links = driver.findElements(By.tagName("a"));
        System.out.println("Total links found: " + links.size());

        for (WebElement link : links) {
            String url = link.getAttribute("href");

            // Skip empty, javascript:void(0), or mailto/tel links — not real HTTP links
            if (url == null || url.isEmpty() || url.startsWith("javascript") || url.startsWith("mailto")) {
                continue;
            }

            checkLinkStatus(url);
        }

        driver.quit();
    }

    private static void checkLinkStatus(String urlString) {
        try {
            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("HEAD"); // HEAD is faster — no response body needed
            connection.setConnectTimeout(5000);
            connection.connect();

            int responseCode = connection.getResponseCode();

            if (responseCode >= 200 && responseCode < 400) {
                System.out.println("VALID  [" + responseCode + "] " + urlString);
            } else {
                System.out.println("BROKEN [" + responseCode + "] " + urlString);
            }
        } catch (Exception e) {
            System.out.println("BROKEN [Exception: " + e.getMessage() + "] " + urlString);
        }
    }
}
```

**Key points:**
- `HttpURLConnection` with `setRequestMethod("HEAD")` checks status without downloading the full page — much faster across many links
- Status codes `200-399` are treated as valid (2xx success, 3xx redirect); `4xx`/`5xx` and connection exceptions are broken
- Filter out `javascript:`, `mailto:`, and empty `href`s before hitting the network — they aren't real HTTP links and will throw `MalformedURLException`
- For a production framework, this logic is usually pulled into a reusable `LinkValidator` utility and run as part of a dedicated link-health test, not mixed into functional UI tests

---

### 5. Java code: remove spaces from a string and print each character with its index

```java
public class StringIndexPrinter {
    public static void main(String[] args) {
        String str = "Automation Test Engineer";

        // Step 1: Remove all spaces
        String noSpaces = str.replaceAll("\\s+", "");
        System.out.println("After removing spaces: " + noSpaces);

        // Step 2: Print each character with its index
        for (int i = 0; i < noSpaces.length(); i++) {
            System.out.println("Index " + i + " -> " + noSpaces.charAt(i));
        }
    }
}
```

**Output (excerpt):**
```
After removing spaces: AutomationTestEngineer
Index 0 -> A
Index 1 -> u
Index 2 -> t
Index 3 -> o
...
Index 22 -> r
```

**Alternative without `replaceAll` (manual loop, often asked as a follow-up "don't use built-in methods"):**

```java
public class StringIndexPrinterManual {
    public static void main(String[] args) {
        String str = "Automation Test Engineer";
        StringBuilder noSpaces = new StringBuilder();

        for (char ch : str.toCharArray()) {
            if (ch != ' ') {
                noSpaces.append(ch);
            }
        }

        for (int i = 0; i < noSpaces.length(); i++) {
            System.out.println("Index " + i + " -> " + noSpaces.charAt(i));
        }
    }
}
```

---

## Round 2: Selenium, TestNG & CI/CD

### 1. If out of 100 test cases, 20 are failed, how will you rerun only the failed test cases?

**Answer:** TestNG automatically generates a `testng-failed.xml` file after every run, listing exactly the failed test methods/classes — rerunning that file re-executes only the failures.

**Method 1 — `testng-failed.xml` (simplest, zero code):**

```bash
# After a run, TestNG auto-generates this file in test-output/
mvn test -DsuiteXmlFile=test-output/testng-failed.xml
```

**Method 2 — `IRetryAnalyzer` (automatic retry within the same run, no manual rerun step):**

```java
public class RetryAnalyzer implements IRetryAnalyzer {
    private int retryCount = 0;
    private static final int MAX_RETRY = 2;

    @Override
    public boolean retry(ITestResult result) {
        if (retryCount < MAX_RETRY) {
            retryCount++;
            return true; // Tells TestNG to retry this test
        }
        return false;
    }
}
```

```java
@Test(retryAnalyzer = RetryAnalyzer.class)
public void verifyCheckout() { /* ... */ }
```

**Method 3 — apply `RetryAnalyzer` to ALL tests automatically via a listener (avoids annotating every `@Test`):**

```java
public class RetryListener implements IAnnotationTransformer {
    @Override
    public void transform(ITestAnnotation annotation, Class testClass,
                           Constructor testConstructor, Method testMethod) {
        annotation.setRetryAnalyzer(RetryAnalyzer.class);
    }
}
```

```xml
<suite name="Suite">
    <listeners>
        <listener class-name="listeners.RetryListener"/>
    </listeners>
</suite>
```

**Which to use when:** `testng-failed.xml` is the quickest for a one-off manual rerun (e.g., after fixing an environment issue). `IRetryAnalyzer` is better for CI pipelines where you want transient failures (network blips, timing) automatically retried within the same build without a second pipeline run.

---

### 2. What are the different ways to use `sendKeys()` to enter text into a text field?

```java
WebElement field = driver.findElement(By.id("username"));

// 1. Direct sendKeys — most common
field.sendKeys("testuser@example.com");

// 2. Clear existing text first, then type (avoids appending to pre-filled/leftover text)
field.clear();
field.sendKeys("testuser@example.com");

// 3. Character by character (rare — simulates slower typing, useful for JS keyup-triggered UIs)
String value = "testuser@example.com";
for (char ch : value.toCharArray()) {
    field.sendKeys(String.valueOf(ch));
}

// 4. Using Actions class (useful when a field requires focus/hover before typing)
new Actions(driver)
    .moveToElement(field)
    .click()
    .sendKeys("testuser@example.com")
    .perform();

// 5. Using JavaScript executor (bypasses native events — fallback when sendKeys() is blocked/unreliable)
JavascriptExecutor js = (JavascriptExecutor) driver;
js.executeScript("arguments[0].value=arguments[1];", field, "testuser@example.com");
// Note: JS-set values often don't fire React/Angular's change events — may need an
// additional dispatchEvent('input') call for JS-framework-bound fields to register the value

// 6. Sending special keys (Enter, Tab, Ctrl+A, etc.)
field.sendKeys(Keys.chord(Keys.CONTROL, "a")); // Select all
field.sendKeys(Keys.ENTER);
```

---

### 3. If `sendKeys()` is not entering text even though locator and code are correct, what could be the reasons?

| Possible cause | How to diagnose / fix |
|-----------------|-------------------------|
| **Element not interactable yet** (still loading/animating) | Wait for `ExpectedConditions.elementToBeVisible()` / `elementToBeClickable()` before calling `sendKeys()` |
| **Element is `readonly` or `disabled`** | Check `getAttribute("readonly")`/`isEnabled()` — some apps enable the field only after a prior action (e.g., checkbox ticked) |
| **Field is actually hidden/overlapped by another element** | An invisible overlay or off-screen positioning intercepts focus; verify with `isDisplayed()` and check z-index/overlap in DevTools |
| **Wrong element matched** (locator matches a hidden duplicate, e.g., a mobile-view clone of the same field) | Use `findElements()` to check the match count; add more specific locator context |
| **Element is inside an iframe** | Must `driver.switchTo().frame(...)` before interacting — a locator that "exists" via `findElement` but sits inside an iframe context won't receive input |
| **JavaScript framework hasn't attached event listeners yet** (React/Angular re-render mid-interaction) | Add a short wait for the specific framework-rendered state, or wait for a stable/idle DOM condition |
| **Field expects a specific input format/mask** (e.g., date picker with JS input masking) | `sendKeys()` may type correctly but the mask immediately reformats/clears it — try slower char-by-char typing, or set via `JavascriptExecutor` + dispatch input event |
| **Browser/window not in focus** (rare, more common in older Selenium/RemoteWebDriver setups) | Ensure the browser window has focus before interacting; avoid running other automation in parallel on the same display |
| **Stale element reference** — element was re-rendered after being located | Re-locate the element immediately before calling `sendKeys()` rather than reusing an old reference |

**Practical debugging approach:**
```java
WebElement field = driver.findElement(By.id("username"));
System.out.println("Displayed: " + field.isDisplayed());
System.out.println("Enabled: " + field.isEnabled());
System.out.println("Tag: " + field.getTagName() + ", Type: " + field.getAttribute("type"));
field.sendKeys("test");
System.out.println("Value after sendKeys: " + field.getAttribute("value"));
```

---

### 4. Same scenario with `click()` — element is not clickable though locator & code are correct. How will you handle it?

This is the classic `ElementClickInterceptedException` / silent no-op click family of issues.

| Cause | Fix |
|-------|-----|
| **Another element overlaps it** (modal, sticky header, spinner) | `wait.until(ExpectedConditions.elementToBeClickable(locator))` + wait for the overlay to disappear (`invisibilityOfElementLocated`) |
| **Element not scrolled into view** | `((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block:'center'});", element);` before clicking |
| **Animation still in progress** | Wait for the element's bounding box to stabilize, or wait for a CSS class/attribute that signals "animation complete" |
| **Element is present in DOM but has zero size / `display:none`** | Confirm with `isDisplayed()`; if hidden by design until a parent state changes, trigger that state first |
| **Click intercepted by a transparent/invisible element on top** | Inspect via DevTools; sometimes a z-index bug in the app itself — worth filing as a real defect, not just working around it |
| **Real actionability issue Selenium correctly caught** (element genuinely isn't clickable in the current app state) | Don't paper over it — verify manually whether a user could actually click it right now; may be a genuine bug |

```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(By.id("submit")));

try {
    btn.click();
} catch (ElementClickInterceptedException e) {
    // Fallback 1: scroll into view then retry
    ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block:'center'});", btn);
    btn.click();
} catch (Exception e) {
    // Fallback 2: JS click as last resort (bypasses actionability checks — use sparingly)
    ((JavascriptExecutor) driver).executeScript("arguments[0].click();", btn);
}
```

**Interview-ready summary:** "I never jump straight to a JS click — that masks real bugs. I first confirm it's an actionability timing issue (wait for clickable + wait for the overlay/spinner to clear + scroll into view), and only fall back to a JS click as a documented last resort, because a JS click can succeed even when a real user genuinely couldn't click that element."

---

### 5. What is CI/CD integration? How do you run automation test cases through a CI/CD pipeline?

**CI/CD (Continuous Integration / Continuous Delivery)** integration means automation tests run automatically as part of the build/deployment pipeline — on every commit, PR, or on a schedule — instead of being triggered manually.

**Why it matters for QA:** Bugs are caught within minutes of being introduced (fast feedback), not days later during a manual regression pass.

**Typical flow:**

```
Code pushed/PR raised → CI triggers build → Maven compiles + runs TestNG suite
    → Reports published (Extent/Allure) → Pass/Fail gate → Merge allowed or blocked
```

**Example — Jenkins pipeline:**

```groovy
pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps { git branch: 'main', url: 'https://github.com/org/automation-repo.git' }
        }
        stage('Run Tests') {
            steps { sh 'mvn clean test -DsuiteXmlFile=testng.xml' }
        }
        stage('Publish Report') {
            steps { junit '**/surefire-reports/*.xml' }
        }
    }
    post {
        failure {
            mail to: 'qa-team@company.com', subject: "Build Failed: ${env.JOB_NAME}", body: "See ${env.BUILD_URL}"
        }
    }
}
```

**Example — GitHub Actions:**

```yaml
name: Run Automation Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: '17', distribution: 'temurin' }
      - run: mvn clean test -DsuiteXmlFile=testng.xml
      - uses: actions/upload-artifact@v4
        if: always()
        with: { name: test-report, path: test-output/ }
```

**Key building blocks of any CI/CD automation setup:**
1. **Trigger** — on push/PR (fast smoke tests) and/or scheduled cron (nightly full regression)
2. **Execution** — `mvn test` / `npx playwright test` invoked headlessly, parameterized by environment/browser
3. **Reporting** — JUnit/Surefire XML, Extent Report, or Allure published as build artifacts
4. **Gate** — build marked failed if tests fail, optionally blocking merge
5. **Notification** — Slack/email alert to the team on failure

---

### 6. Explain your Automation Framework (structure, design, tools)

**Sample Answer:**

"My framework is built on **Selenium WebDriver + Java + TestNG + Maven**, following the **Page Object Model** with a hybrid data-driven approach.

**Structure:**

```
Framework/
├── src/main/java/
│   ├── pages/           # Page Object classes (locators + actions)
│   ├── base/            # BaseTest — driver init/teardown
│   ├── utils/           # ExcelUtils, WaitUtils, ScreenshotUtils
│   ├── listeners/       # TestNG ITestListener (screenshot-on-failure, retry)
│   └── factory/         # DriverFactory (ThreadLocal<WebDriver>, browser via config)
├── src/test/java/tests/ # Test classes calling Page Objects
├── src/test/resources/  # Test data (Excel/JSON), config properties
├── testng.xml           # Suite config, groups, parallel execution
├── pom.xml               # Maven dependencies, Surefire plugin config
└── reports/              # Extent Report / Allure output
```

**Design decisions I'd highlight:**
- `DriverFactory` with `ThreadLocal<WebDriver>` for safe parallel execution
- `BasePage` centralizing wait/click/type so Page Objects don't duplicate `WebDriverWait` boilerplate
- **Explicit waits only** — zero `Thread.sleep()` in the codebase
- Data-driven via `@DataProvider` reading Excel/JSON, decoupled from test logic
- `RetryAnalyzer` + TestNG listener for auto screenshot-on-failure and Extent Report generation
- CI/CD via Jenkins — parameterized `mvn test` by browser/environment, publishing reports as build artifacts
- API setup (RestAssured) used ahead of UI tests where possible, to keep the suite fast

**Tools:** Selenium WebDriver, Java, TestNG, Maven, RestAssured, Extent Reports, Jenkins, Git."

**Tip:** Be ready to explain *why*, not just *what* — interviewers commonly probe design choices like "why ThreadLocal?" or "why explicit over implicit waits?" (see the Deloitte Round 2 section above for the kind of follow-up depth to expect).

---

## Client Interview

### 1. Introduction

*(Refer to the "Introduce yourself" sample answers in the Deloitte and Oracle sections above — structure: Intro → current role → tech stack → one measurable achievement, kept under 90 seconds.)*

---

### 2. How have you used AI in your daily automation work?

**Sample Answer:**

"I use AI tools primarily to speed up repetitive, mechanical parts of automation work — not to replace test design judgment.

**Concrete ways I use it:**
- **Locator/test scaffolding** — generating a first draft of Page Object boilerplate or a TestNG data provider structure, which I then review and adjust to match our framework's conventions
- **Test case brainstorming** — given a user story, asking AI to suggest edge cases/negative scenarios I might not have thought of, then filtering to what's actually relevant
- **Debugging assistance** — pasting a stack trace or a flaky test's failure pattern to get a faster first hypothesis on root cause, which I then verify against the actual trace/logs
- **Code review support** — using AI-assisted review (e.g., in the IDE) to catch obvious issues (unused imports, missing null checks) before a human review, so reviewers focus on logic/design
- **Documentation** — drafting first-pass README/framework documentation, which I then edit for accuracy
- **Regex/XPath generation** — quickly generating a starting regex or XPath expression for a tricky dynamic locator, which I then validate and simplify

**What I don't do:** I don't blindly accept AI-generated assertions or test logic without understanding and verifying them — the risk is a test that looks correct but doesn't actually validate the right business behavior. AI accelerates the mechanical parts; the judgment on *what* to test and *why* still has to come from understanding the requirement."

---

### 3. How do you execute automation test cases?

**Answer — typical execution paths, from local to CI:**

```bash
# 1. Run a single test class locally (during development)
mvn test -Dtest=LoginTest

# 2. Run a full suite via testng.xml
mvn test -DsuiteXmlFile=testng.xml

# 3. Run a specific TestNG group (smoke, regression, sanity)
mvn test -Dgroups=smoke

# 4. Run in parallel across browsers/threads (configured in testng.xml)
mvn test -DsuiteXmlFile=testng-parallel.xml

# 5. Run via CI/CD pipeline (Jenkins/GitHub Actions) — triggered automatically on push/PR/schedule
```

**In practice:**
- **Local development** — run the specific test/class I'm working on for fast feedback
- **Pre-merge (PR)** — smoke/sanity group runs automatically via CI
- **Nightly** — full regression suite runs on a scheduled Jenkins job against the QA environment
- **Pre-release** — full regression + cross-browser suite run manually triggered before a release sign-off

Reports (Extent/Allure) are generated after each run and published as CI build artifacts for the team to review.

---

### 4. Which CI/CD tools have you used and how did you configure your test execution?

**Answer:**

"I've primarily used **Jenkins**, and also worked with **GitHub Actions**.

**Jenkins configuration:**
- Created a **Jenkinsfile** (Declarative Pipeline) checked into the repo, with stages: Checkout → Build → Run Tests → Publish Reports → Notify
- Used **parameters** (`choice` for browser/environment) so the same pipeline runs against Chrome/Firefox and QA/Staging without duplicating jobs
- Configured **Build Triggers** — `Poll SCM` for CI-on-push, and a **CRON schedule** (`H 1 * * *`) for nightly full regression
- Set up **`post` blocks** for email/Slack notification on failure, and `archiveArtifacts` for screenshots/videos on failed tests
- Used the **JUnit plugin** (`junit '**/surefire-reports/*.xml'`) to publish TestNG results directly into Jenkins' Tests tab

**GitHub Actions configuration:**
- Workflow YAML triggered on `push`/`pull_request`, with a matrix strategy to run across multiple browsers in parallel
- `actions/upload-artifact` to publish the HTML/Extent report and screenshots as downloadable build artifacts
- Branch protection rules requiring the test job to pass before a PR can be merged

**Common to both:** parameterized execution (browser/env), automatic report publishing, and failure notifications routed to the team — so a broken build is visible within minutes, not discovered during the next manual test pass."

---

### 5. Which reporting tool do you use and why?

**Answer:**

"I primarily use **Extent Reports**, and have also worked with **Allure Reports**.

| Feature | Why it matters |
|---------|-----------------|
| **Rich HTML dashboard** | Pass/fail/skip counts, execution time, and trends visible at a glance — easy to share with non-technical stakeholders |
| **Screenshot attachment on failure** | Auto-attached via a TestNG listener's `onTestFailure()` — no need to dig through logs to see what actually happened |
| **Step-level logging** | I log meaningful steps (`test.log(Status.INFO, "Navigated to login page")`) so a failure report reads like a narrative, not just a stack trace |
| **Categorization** | Tests grouped by module/suite (`@Test(groups = {"checkout"})`), so a stakeholder can filter to just their area |
| **Historical trend view** (Allure) | Allure's timeline/trend graphs are stronger than Extent's for tracking flakiness and pass-rate over multiple runs |

**Why this over just TestNG's default HTML report:** the default report is functional but not stakeholder-friendly — no screenshots, no narrative logging, harder to scan quickly. A good report is often the *only* artifact a non-QA stakeholder (PM, dev lead) actually looks at, so investing in report quality has an outsized impact on how the QA function's work is perceived."

---

### 6. How do you handle flaky test cases?

**Answer:**

"I treat flaky tests as a signal to investigate, not something to mask with blanket retries.

**My process:**

1. **Detect** — track flake rate per test in CI (a test that intermittently fails without code changes); don't ignore a test that 'usually passes'
2. **Reproduce** — run it repeatedly (`--repeat-each=10` in Playwright, or a loop in TestNG) to confirm and isolate the pattern
3. **Root-cause, don't just retry:**

| Common cause | Fix |
|--------------|-----|
| Hard-coded `Thread.sleep()` | Replace with explicit `WebDriverWait` / `ExpectedConditions` |
| Race condition (assert before async update completes) | Wait on the actual condition (`waitForResponse`, `ExpectedConditions.textToBePresentInElement`) |
| Shared test data across parallel runs | Generate unique data per test/thread (`ThreadLocal`, timestamp-based IDs) |
| Environment/network instability | Mock unstable third-party dependencies |
| Element timing/animation | Wait for element stability before interacting |

4. **Use retry as a safety net, not the fix** — I configure `IRetryAnalyzer`/TestNG `retries` (or Playwright's `retries: 2` in CI) so a genuinely transient blip doesn't fail the build, but I still track and fix the underlying cause rather than letting retries hide a real bug indefinitely
5. **Quarantine persistent offenders** — if a test keeps flaking despite fixes, I tag it (`@flaky`) and exclude it from the blocking CI gate temporarily, while it stays visible on a dashboard so it doesn't get forgotten
6. **Report transparently** — flaky tests erode trust in the whole suite; I'd rather tell the team 'this test is flaky and being fixed' than let a green pipeline hide real instability."

---

## 8. GlobalLogic — Interview Questions

*Recent GlobalLogic interview questions across three rounds: Core Java/OOP + Selenium technical round, a techno-managerial round covering framework design, BDD, and CI/CD, and a closing HR round. Contributed by: Ajay.*

---

## Round 1: Technical

### 1. Write a Java program to reverse the first and last digit of a number without converting it into a string

```java
public class ReverseFirstLastDigit {

    public static void main(String[] args) {
        int number = 4567;
        System.out.println("Original number: " + number);
        System.out.println("After swapping first & last digit: " + swapFirstLastDigit(number));
    }

    public static int swapFirstLastDigit(int num) {
        if (num < 10) return num; // single digit — nothing to swap

        boolean isNegative = num < 0;
        num = Math.abs(num);

        int lastDigit = num % 10;

        // Find the number of digits to extract the first digit without converting to String
        int temp = num;
        int digitCount = 0;
        while (temp > 0) {
            temp /= 10;
            digitCount++;
        }

        int divisor = (int) Math.pow(10, digitCount - 1);
        int firstDigit = num / divisor;

        // Remove old first digit, remove old last digit, then place swapped digits back
        int middlePart = (num % divisor) / 10;   // strips the first digit, then the last digit
        int result = firstDigit                              // new last digit (was first)
                + middlePart * 10
                + lastDigit * divisor;                        // new first digit (was last)

        return isNegative ? -result : result;
    }
}
// Input:  4567  -> Output: 7564  (4 and 7 swapped)
// Input:  1234  -> Output: 4231
// Input:  50    -> Output: 05 -> printed as 5 (leading zero can't be preserved in an int)
```

**Key points:**
- Uses pure arithmetic (`%`, `/`, `Math.pow`) — no `String`/`charAt`/`toCharArray` involved
- Handles negative numbers by working on the absolute value and reapplying the sign
- Edge case to call out: if the original last digit is `0` and becomes the new first digit, the numeric result silently drops the leading zero (e.g., `50 → 05` is just `5`) — worth mentioning proactively since interviewers often probe this exact edge case

---

### 2. Difference between an interface and an abstract class in Java

| Aspect | Interface | Abstract Class |
|--------|-----------|-----------------|
| Method implementation | Traditionally no bodies (Java 8+ allows `default`/`static` methods) | Can have both abstract and fully implemented methods |
| Fields | Only `public static final` constants | Any instance variables (`private`, `protected`, `public`) |
| Constructors | Not allowed | Allowed (called via `super()` from subclasses) |
| Multiple inheritance | A class can implement multiple interfaces | A class can extend only one abstract class |
| Access modifiers on methods | `public` by default | Can be `public`, `protected`, or package-private |
| When to use | Define a **capability/contract** unrelated classes can share (`Comparable`, `Runnable`) | Define a **common base** for closely related classes sharing state and partial behavior |

```java
interface Drivable {
    void drive();                       // contract only
    default void honk() {               // Java 8+ default method
        System.out.println("Beep!");
    }
}

abstract class Vehicle {
    protected String registrationNumber;   // shared state

    public Vehicle(String regNo) {         // constructor allowed
        this.registrationNumber = regNo;
    }

    abstract void start();                 // must be implemented by subclass

    public void printRegistration() {      // shared, fully implemented behavior
        System.out.println("Reg No: " + registrationNumber);
    }
}

class Car extends Vehicle implements Drivable {
    public Car(String regNo) { super(regNo); }
    void start() { System.out.println("Car starting..."); }
    public void drive() { System.out.println("Driving the car"); }
}
```

**Interview-ready summary:** "I reach for an interface when I need to define a capability that unrelated classes can plug into (e.g., `WebDriver` — `ChromeDriver` and `FirefoxDriver` share nothing but the contract). I reach for an abstract class when subclasses genuinely share state and partial implementation — e.g., a `BasePage` holding a common `driver` field and `waitAndClick()` method that every Page Object inherits."

---

### 3. Have you used design patterns such as Singleton or Factory in your automation framework?

**Answer:** Yes — these two show up naturally in almost every mature Selenium framework.

**Singleton — one `WebDriver` instance per thread:**

```java
public class DriverManager {
    private static ThreadLocal<WebDriver> driver = new ThreadLocal<>();

    private DriverManager() { } // private constructor — prevents external instantiation

    public static WebDriver getDriver() {
        return driver.get();
    }

    public static void setDriver(WebDriver webDriver) {
        driver.set(webDriver);
    }

    public static void unload() {
        driver.remove();
    }
}
```

**Factory — creating the right browser driver based on config, without the caller knowing the concrete class:**

```java
public class DriverFactory {
    public static WebDriver createDriver(String browser) {
        WebDriver driver;
        switch (browser.toLowerCase()) {
            case "chrome":  driver = new ChromeDriver(); break;
            case "firefox": driver = new FirefoxDriver(); break;
            case "edge":    driver = new EdgeDriver(); break;
            default: throw new IllegalArgumentException("Unsupported browser: " + browser);
        }
        DriverManager.setDriver(driver);
        return driver;
    }
}
```

**Other patterns worth mentioning if asked to go deeper:**

| Pattern | Where it shows up |
|---------|---------------------|
| **Page Object Model (a Facade-like pattern)** | Each `LoginPage`/`DashboardPage` hides the DOM complexity behind simple method calls |
| **Builder** | Constructing complex `ChromeOptions`/test-data objects step by step (`new ChromeOptions().addArguments(...)`) |
| **Fluent Interface** | Chaining actions on a Page Object (`loginPage.enterUsername(x).enterPassword(y).submit()`) |
| **Strategy** | Swapping wait strategies or reporting strategies (Extent vs Allure) behind a common interface |

**Interview-ready summary:** "Singleton (via `ThreadLocal`) ensures each parallel test thread gets exactly one `WebDriver` instance without leaking across threads; Factory decouples 'which browser to launch' from the rest of the framework, so adding a new browser is a one-line change in `DriverFactory`, not a change everywhere `WebDriver` is used."

---

### 4. Difference between `HashMap` and `TreeMap` in Java? Give an example.

| Aspect | `HashMap` | `TreeMap` |
|--------|-----------|-----------|
| Ordering | No guaranteed order | Sorted by key (natural order or a `Comparator`) |
| Null keys | One `null` key allowed | No `null` keys allowed (throws `NullPointerException`) |
| Performance | O(1) average for get/put | O(log n) for get/put (backed by a Red-Black tree) |
| Underlying structure | Hash table | Red-Black Tree |
| Implements | `Map` | `Map`, `SortedMap`, `NavigableMap` |

```java
import java.util.HashMap;
import java.util.TreeMap;
import java.util.Map;

public class MapComparisonDemo {
    public static void main(String[] args) {
        Map<String, Integer> hashMap = new HashMap<>();
        hashMap.put("Zebra", 1);
        hashMap.put("Apple", 2);
        hashMap.put("Mango", 3);
        System.out.println("HashMap: " + hashMap);
        // Order is unpredictable — e.g., {Mango=3, Apple=2, Zebra=1}

        Map<String, Integer> treeMap = new TreeMap<>();
        treeMap.put("Zebra", 1);
        treeMap.put("Apple", 2);
        treeMap.put("Mango", 3);
        System.out.println("TreeMap: " + treeMap);
        // Always sorted by key: {Apple=2, Mango=3, Zebra=1}
    }
}
```

**When I'd use which in automation:** `HashMap` for general-purpose key-value test data/config lookups where order doesn't matter (fast). `TreeMap` when I need test data or report entries to always print in a predictable, sorted order — e.g., sorting API response fields alphabetically before comparing two JSON payloads.

---

### 5. Difference between Assert and Verify in Selenium?

| Aspect | Assert (`Assert.assertEquals`, TestNG/JUnit) | Verify (soft assertion — `SoftAssert` in TestNG, or `assertAll` pattern) |
|--------|------------------------------------------------|-----------------------------------------------------------------------------|
| On failure | **Stops test execution immediately** — throws `AssertionError` | **Logs the failure but continues** executing the rest of the test |
| Use case | Critical checkpoints where continuing further makes no sense (e.g., login failed → no point testing the dashboard) | Multiple independent checks in one test where you want to see *all* failures, not just the first |
| TestNG support | Built-in `Assert` class | `SoftAssert` class — must call `assertAll()` at the end to actually report failures |

```java
// Hard assert — stops immediately on failure
Assert.assertEquals(driver.getTitle(), "Dashboard", "Title mismatch — halting test");
driver.findElement(By.id("next")).click(); // never runs if the assert above fails

// Soft assert — collects failures, keeps running
SoftAssert softAssert = new SoftAssert();
softAssert.assertEquals(page.getBalance(), "₹5000", "Balance mismatch");
softAssert.assertTrue(page.isLogoutVisible(), "Logout button missing");
softAssert.assertEquals(page.getUserName(), "Test User", "Username mismatch");
softAssert.assertAll(); // reports ALL collected failures here, at the end
```

**Interview-ready summary:** "I use hard `Assert` for a checkpoint that the rest of the test depends on — no point validating the dashboard if login itself failed. I use `SoftAssert`/verify when I'm validating several independent fields on one page (e.g., a profile page's name, email, phone) and want one test run to report every mismatch instead of stopping at the first."

---

### 6. `Thread.sleep()` vs `WebDriverWait` in Selenium?

| Aspect | `Thread.sleep()` | `WebDriverWait` |
|--------|--------------------|---------------------|
| Wait type | Fixed, unconditional pause | Conditional — polls until a specific condition is true |
| Efficiency | Always waits the full duration, even if the element is ready in 1 second | Returns as soon as the condition is met — no wasted time |
| Reliability | Flaky — too short = test fails, too long = wastes time across hundreds of tests | Reliable — waits exactly as long as needed, up to a timeout |
| Exception on timeout | None — code just proceeds and fails later with a confusing error | Throws a clear `TimeoutException` naming the condition that wasn't met |

```java
// ❌ Thread.sleep() — always waits the fixed 5000ms, flaky if the page is ever slower
Thread.sleep(5000);
driver.findElement(By.id("submit")).click();

// ✅ WebDriverWait — waits only as long as necessary, up to a 10s cap
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
wait.until(ExpectedConditions.elementToBeClickable(By.id("submit"))).click();
```

**Interview-ready summary:** "`Thread.sleep()` is a blind, fixed delay — it's the single biggest source of both flakiness and wasted execution time in a legacy Selenium suite. `WebDriverWait` polls for the actual condition (visible, clickable, text present) and returns immediately once satisfied, so a good framework has effectively zero `Thread.sleep()` calls in it."

---

### 7. Write Selenium code to handle a file download from the browser

```java
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import java.io.File;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

public class FileDownloadTest {

    public static void main(String[] args) throws InterruptedException {
        String downloadPath = System.getProperty("user.dir") + "/downloads";

        // Configure Chrome to download files automatically to a known folder,
        // without showing the "Save As" dialog
        Map<String, Object> prefs = new HashMap<>();
        prefs.put("download.default_directory", downloadPath);
        prefs.put("download.prompt_for_download", false);
        prefs.put("plugins.always_open_pdf_externally", true); // don't preview PDFs in-browser

        ChromeOptions options = new ChromeOptions();
        options.setExperimentalOption("prefs", prefs);

        WebDriver driver = new ChromeDriver(options);
        driver.get("https://example.com/reports");
        driver.findElement(org.openqa.selenium.By.id("download-statement-btn")).click();

        // Poll the download folder until the file appears (downloads are async)
        File downloadedFile = new File(downloadPath, "statement.pdf");
        int maxWaitSeconds = 15;
        int waited = 0;
        while (!downloadedFile.exists() && waited < maxWaitSeconds) {
            Thread.sleep(1000); // acceptable here — polling for an OS-level file event,
                                 // not an element on the page
            waited++;
        }

        if (downloadedFile.exists()) {
            System.out.println("File downloaded successfully: " + downloadedFile.getAbsolutePath());
        } else {
            throw new RuntimeException("File was not downloaded within " + maxWaitSeconds + " seconds");
        }

        driver.quit();
    }
}
```

**Key points:**
- Setting `download.default_directory` and `download.prompt_for_download: false` via Chrome prefs makes downloads land in a **known, predictable folder** without a native OS "Save As" dialog (which Selenium cannot interact with — it's outside the browser DOM)
- Since a download is an OS-level file-system event, not a DOM element, `WebDriverWait`/`ExpectedConditions` don't apply directly — polling the file system (or using a small utility method) is the standard approach
- For CI environments (headless), the same Chrome prefs work without any changes

---

### 8. What steps would you take if an element is not interactable in Selenium?

This maps to `ElementNotInteractableException` — the element exists in the DOM but cannot currently be acted upon.

**Diagnostic checklist, in order:**

1. **Check visibility** — `element.isDisplayed()`. If `false`, wait for it (`ExpectedConditions.visibilityOfElementLocated`) or trigger whatever makes it visible (e.g., expand a collapsed section first).
2. **Check if it's enabled** — `element.isEnabled()`. A `disabled` form field is present but not interactable until some other condition (e.g., a checkbox) enables it.
3. **Check for an overlapping element** — a modal, spinner, or sticky header sitting on top; wait for it to disappear (`invisibilityOfElementLocated`) before interacting.
4. **Scroll it into view** — elements outside the current viewport can be present but not interactable in some browser/driver combinations:
   ```java
   ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block:'center'});", element);
   ```
5. **Check if it's inside an iframe** — a locator can find an element "inside" an iframe from the top-level DOM query, but Selenium can't interact with it until you `driver.switchTo().frame(...)` first.
6. **Check element size** — a `width: 0` or `height: 0` element (common with custom-styled checkboxes/radios) is technically "displayed" but has no interactable surface; interact with its associated visible label instead.
7. **Last resort — JavaScript click/set value**, only after confirming it's a genuine framework/rendering quirk and not a real bug a user would also hit:
   ```java
   ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
   ```

**Interview-ready summary:** "I work through actionability top-down — visible, enabled, not obscured, in viewport, not trapped in an iframe — before ever reaching for a JS-based workaround, because a JS click can succeed in cases a real user genuinely couldn't interact with the element, which would mask an actual UI bug."

---

### 9. Difference between Alpha testing and Beta testing? Give examples.

| Aspect | Alpha Testing | Beta Testing |
|--------|-----------------|-----------------|
| Performed by | Internal QA team, at the development site | Real end users / a limited external audience, in their own environment |
| Environment | Controlled, simulated environment | Real-world, uncontrolled environment |
| Timing | Before the product is released externally | After alpha testing, just before the final public release |
| Visibility of issues | Functional bugs, usability issues found early | Real-world usage patterns, edge cases, and environment-specific issues (device, network, OS) |
| Feedback loop | Internal bug reports, fixed immediately by the same team | User feedback, crash reports, usage analytics gathered over a beta period |

**Example:**
- **Alpha testing:** Before releasing a new "Fund Transfer" feature for a banking app, the internal QA team tests it thoroughly in the SIT environment — functional flows, edge cases, negative scenarios — entirely behind closed doors.
- **Beta testing:** The feature is then rolled out to a small group of real customers (e.g., 5% of users via a feature flag) in production, and the team monitors crash reports, support tickets, and usage data for issues that only show up with real devices, real networks, and real user behavior that internal QA didn't think to test.

---

### 10. Describe a difficult bug you discovered in your testing and how you resolved it. Give an example.

**Sample Answer (structure to adapt with a real project example):**

> "On a banking automation project, our fund-transfer regression suite started failing intermittently — roughly 1 in 15 runs — with the transfer amount showing as `₹0` instead of the entered value, but only in the CI pipeline, never when I ran the same test locally.
>
> **Investigation:** I first ruled out a flaky locator by checking the Selenium logs — the field was being found and `sendKeys()` was executing without exception. I then enabled a custom listener to capture a screenshot **immediately before and after** the `sendKeys()` call, and noticed the amount field briefly showed a loading spinner overlay right as we typed — the amount input was being **re-rendered by a React component** milliseconds after the field became visible, wiping out anything typed during that window.
>
> **Root cause:** A race condition — our explicit wait was checking `elementToBeClickable`, which was satisfied *before* the React re-render settled, so we were typing into a field that got wiped a moment later.
>
> **Fix:** I replaced the wait with a custom `ExpectedCondition` that additionally checked the field's bounding box was stable across two consecutive polls (mirroring Selenium 4/Playwright's "element stability" check), effectively waiting for the re-render to finish before interacting. I also reported it to the dev team as a genuine UX bug — a real user typing quickly during that window would have hit the exact same data-loss issue.
>
> **Result:** The flaky failure disappeared entirely from the regression suite, and the dev team fixed the underlying re-render race condition so real users wouldn't silently lose their entered amount either."

**Why this is a strong answer:** It shows a structured debugging process (rule out the obvious → gather evidence → find root cause → fix at the right layer), and frames the "bug" as something that mattered beyond just the test — it was a real, user-facing issue the automation surfaced.

---

## Round 2: Techno-Managerial Round

### 1. Explain the key components of the test automation framework you worked on

*(Refer to the "Explain your Automation Framework" answers in the Deloitte, Oracle, and HCLTech sections above for a full sample structure — `DriverFactory` with `ThreadLocal<WebDriver>`, `BasePage`/`BaseTest`, data-driven `@DataProvider`, TestNG listeners for screenshot-on-failure and reporting, and CI/CD integration via Jenkins.)*

**Key components to name explicitly in this round, with the *why* for each:**

| Component | Why it exists |
|-----------|-----------------|
| `DriverFactory` (Singleton + Factory pattern) | One `WebDriver` per thread, browser choice abstracted from tests |
| `BasePage` | Centralizes `waitAndClick`/`waitAndType` so Page Objects don't duplicate wait logic |
| `BaseTest` | Owns setup/teardown lifecycle (`@BeforeMethod`/`@AfterMethod`) |
| Page Objects | Encapsulate locators + page-specific behavior, hide the DOM from test classes |
| `utils/` (ExcelUtils, WaitUtils, ScreenshotUtils) | Reusable cross-cutting helpers, not tied to any one page |
| TestNG Listener | Auto screenshot-on-failure, retry logic, Extent Report generation |
| `testng.xml` | Suite composition, grouping (`smoke`, `regression`), parallel execution config |
| CI/CD (Jenkins) | Parameterized, scheduled, and on-commit execution with published reports |

---

### 2. Can you write Selenium code to zoom in on a webpage?

```java
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;

public class ZoomPageDemo {
    public static void zoomPage(WebDriver driver, int zoomPercentage) {
        // Zoom via CSS transform/zoom property using JavaScript
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("document.body.style.zoom='" + zoomPercentage + "%'");
    }

    public static void main(String[] args) {
        WebDriver driver = new org.openqa.selenium.chrome.ChromeDriver();
        driver.get("https://example.com");

        zoomPage(driver, 150); // Zoom in to 150%

        // Alternative: simulate Ctrl + "+" keyboard shortcut
        // new Actions(driver).keyDown(Keys.CONTROL).sendKeys(Keys.ADD).keyUp(Keys.CONTROL).perform();

        driver.quit();
    }
}
```

**Key points:**
- `document.body.style.zoom` is a simple, reliable cross-element way to zoom an entire page via JS — note it's a **non-standard CSS property** supported by Chromium/WebKit browsers but not Firefox, which needs a different approach (`transform: scale()` with adjusted `transform-origin`)
- The `Ctrl` + `+`/`-` keyboard shortcut approach via `Actions` simulates a real user zooming, but its effect is harder to verify (it changes the browser's own zoom level, not a page style), so the JS approach is generally preferred for automated verification

---

### 3. Can you perform a mouse hover action on an element using Selenium?

```java
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.By;
import org.openqa.selenium.interactions.Actions;

public class HoverActionDemo {
    public static void main(String[] args) {
        WebDriver driver = new org.openqa.selenium.chrome.ChromeDriver();
        driver.get("https://example.com/menu");

        WebElement menuItem = driver.findElement(By.id("account-menu"));

        Actions actions = new Actions(driver);
        actions.moveToElement(menuItem).perform();

        // Common follow-up: the hover reveals a sub-menu — click an item in it
        WebElement subMenuItem = driver.findElement(By.linkText("Account Settings"));
        actions.moveToElement(subMenuItem).click().perform();

        driver.quit();
    }
}
```

**Key points:**
- `Actions.moveToElement()` moves the virtual mouse over the element, which triggers CSS `:hover` states and any `mouseover`/`mouseenter` JS event listeners
- The sub-menu item usually only becomes "interactable" *after* the hover — attempting to locate/click it before the hover often fails, so the hover must happen first, in the same or a chained `Actions` sequence
- `.build().perform()` vs `.perform()` directly — `.perform()` implicitly builds and executes the action chain in one call, which is the modern, simpler syntax

---

### 4. Can you write Selenium code to capture a screenshot with a custom file name?

```java
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.apache.commons.io.FileUtils;
import java.io.File;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;

public class ScreenshotUtils {

    public static String captureScreenshot(WebDriver driver, String testName) {
        TakesScreenshot ts = (TakesScreenshot) driver;
        File source = ts.getScreenshotAs(OutputType.FILE);

        // Build a custom, unique file name: testName + timestamp
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String customFileName = testName + "_" + timestamp + ".png";
        String destinationPath = "screenshots/" + customFileName;

        try {
            FileUtils.copyFile(source, new File(destinationPath));
            System.out.println("Screenshot saved: " + destinationPath);
        } catch (IOException e) {
            System.out.println("Failed to save screenshot: " + e.getMessage());
        }

        return destinationPath;
    }

    public static void main(String[] args) {
        WebDriver driver = new org.openqa.selenium.chrome.ChromeDriver();
        driver.get("https://example.com");

        captureScreenshot(driver, "LoginPage_VerifyDashboard");
        // Output file: screenshots/LoginPage_VerifyDashboard_20260824_113045.png

        driver.quit();
    }
}
```

**Key points:**
- Naming the file with `testName + timestamp` prevents overwrites when the same test runs multiple times (retries, parallel execution) and makes it trivial to trace a screenshot back to its test in a shared `screenshots/` folder
- This is exactly the utility method a TestNG `ITestListener.onTestFailure()` calls, passing `result.getName()` as `testName`, to auto-capture failure screenshots

---

### 5. Write a Selenium code to handle file uploads

```java
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class FileUploadDemo {
    public static void main(String[] args) {
        WebDriver driver = new org.openqa.selenium.chrome.ChromeDriver();
        driver.get("https://example.com/kyc-upload");

        // Standard <input type="file"> — sendKeys() with the absolute file path works
        // directly, WITHOUT needing to click first or interact with the native OS dialog
        WebElement uploadInput = driver.findElement(By.id("upload-document"));
        String filePath = System.getProperty("user.dir") + "/test-data/pan-card.pdf";
        uploadInput.sendKeys(filePath);

        // Multiple files (if the input supports 'multiple' attribute) — separate paths with '\n'
        WebElement multiUploadInput = driver.findElement(By.id("upload-documents"));
        String file1 = System.getProperty("user.dir") + "/test-data/pan-card.pdf";
        String file2 = System.getProperty("user.dir") + "/test-data/address-proof.pdf";
        multiUploadInput.sendKeys(file1 + "\n" + file2);

        driver.findElement(By.id("submit-kyc")).click();
        driver.quit();
    }
}
```

**Key points:**
- For a standard HTML `<input type="file">`, Selenium's `sendKeys(absoluteFilePath)` works directly — **no need to click the button and handle a native OS file-picker dialog**, since Selenium can't interact with native OS windows outside the browser
- For **custom-styled upload widgets** that hide the real `<input type="file">` behind a styled button, locate the underlying (often visually hidden) `<input>` element directly and `sendKeys()` to it — don't try to click the styled button, which would trigger the native OS dialog Selenium can't touch
- If the real native OS dialog is unavoidable (rare, poorly-built widgets), tools like **Robot class** (Java AWT) or **AutoIT** (Windows-only) are the fallback — but this should be a last resort, not the default approach

---

### 6. What challenges have you faced while running tests on multiple browsers at the same time using Selenium Grid?

**Common challenges and how I addressed them:**

| Challenge | How I resolved it |
|-----------|----------------------|
| **Node capacity/resource contention** — too many parallel sessions crashing browsers or timing out | Tuned the number of concurrent sessions per node to match actual CPU/memory capacity; added a queueing mechanism instead of overloading nodes |
| **Browser version drift** — Grid nodes running different Chrome/Firefox versions than what tests were written against | Standardized node images (Docker containers with pinned browser versions) rather than relying on whatever was installed on each machine |
| **Test data collisions** — parallel tests across browsers hitting the same shared test account/data | Generated unique test data per session (thread-index or timestamp-based), never reused a fixed account across parallel runs |
| **Flaky session creation** — intermittent `SessionNotCreatedException` under high load | Added retry logic specifically around driver/session creation (not the whole test), with a short backoff |
| **Inconsistent screenshots/videos across nodes** — hard to debug a failure on a remote node visually | Centralized screenshot/video capture and shipped artifacts to a shared location (not local to the node) so they survived after the node was recycled |
| **Network latency to remote nodes** — slower element interactions than local execution | Adjusted timeouts to account for network overhead specifically in the Grid config, separate from local run timeouts |

**Interview-ready summary:** "The mechanics of 'run in parallel across browsers' are what Grid gives you for free — the actual engineering challenge is making sure parallel runs don't fight over shared resources: test data, node capacity, or browser version consistency. Most Grid instability I've debugged traced back to one of those three, not Grid itself."

---

### 7. What are the key challenges you have faced in testing dynamic websites? Give some practical scenarios.

| Challenge | Practical Scenario | How I handled it |
|-----------|----------------------|------------------------|
| **Dynamically generated IDs/classes** | A React app renders `<button id="btn_a8f21x">` — the suffix changes on every build/deploy | Switched to role/text-based locators (`getByRole`, XPath `contains(text(), '...')`) instead of relying on the volatile ID |
| **Asynchronous content loading** | A dashboard's balance figure loads via a background API call after the page itself has "loaded" | Used explicit waits on the *actual content* (`textToBePresentInElement`) rather than just page-load state |
| **Elements re-rendering mid-interaction** | Typing into an amount field that gets wiped by a React re-render a moment later (see Q10 above) | Added a custom stability check before interacting, not just a visibility/clickability check |
| **Infinite scroll / lazy-loaded lists** | A transaction history list only loads the next batch of rows when scrolled into view | Scripted incremental scrolling + waiting for new rows to appear before extracting all data |
| **Pop-ups/overlays appearing unpredictably** | A "rate our app" modal randomly appears mid-flow, blocking the next click | Added a defensive check-and-dismiss step before critical actions, rather than assuming a clean flow |
| **Data that changes between test runs** | A "Top 5 products" widget reorders based on live sales data | Asserted on structural/behavioral properties (5 items shown, each has a price) rather than exact product names/order |

**Interview-ready summary:** "Dynamic websites break the assumption that 'the DOM is stable the moment the page loads' — almost every issue traces back to that. My approach is to wait for and assert on the *actual condition that matters* (content present, element stable, count correct) rather than a proxy signal like page-load state or a fixed locator that happens to work today."

---

### 8. What is the role of feature files in Cucumber BDD?

A **feature file** (`.feature`) is a plain-text file written in **Gherkin syntax** (`Given/When/Then`) that describes application behavior in a business-readable format, independent of the underlying automation implementation.

```gherkin
Feature: Fund Transfer

  Scenario: Successful IMPS transfer within available balance
    Given the user is logged in with a savings account
    When the user transfers "₹5000" via IMPS to a saved beneficiary
    Then the transfer should be marked as "Successful"
    And the account balance should be reduced by "₹5000"
```

**Role feature files play:**

1. **Living documentation** — a non-technical stakeholder (BA, Product Owner) can read the feature file and understand exactly what's being tested, without knowing Java/Selenium
2. **Separation of concerns** — the *what* (business behavior, in the feature file) is fully decoupled from the *how* (step definitions + Page Objects, in Java)
3. **Reusability of steps** — a step like `Given the user is logged in with a savings account` can be reused across dozens of scenarios without rewriting the login logic
4. **Collaboration tool (Three Amigos)** — feature files are often written or reviewed together by a developer, tester, and business analyst *before* development starts, aligning everyone on expected behavior upfront
5. **Data-driven scenarios via `Scenario Outline` + `Examples`** — the same scenario can run against multiple data sets without duplicating Gherkin text

**Interview-ready summary:** "A feature file is the contract for 'what should happen', written in a language business stakeholders can validate directly — the corresponding Java step definitions are just the technical translation of that contract into actual browser/API calls."

---

### 9. Static binding and dynamic binding in Java? Give some practical examples

| Aspect | Static Binding (Early Binding) | Dynamic Binding (Late Binding) |
|--------|-----------------------------------|-------------------------------------|
| Resolved at | Compile time | Runtime |
| Applies to | Overloaded methods, `static`/`private`/`final` methods, variables | Overridden methods (runtime polymorphism) |
| Based on | Reference type | Actual object type |

```java
class BasePage {
    public void waitForPageLoad() {
        System.out.println("Generic page load wait");
    }

    // Overloading — static binding, resolved at compile time based on argument types
    public void waitForElement(WebElement el) {
        System.out.println("Waiting with default timeout");
    }
    public void waitForElement(WebElement el, int seconds) {
        System.out.println("Waiting with custom timeout: " + seconds);
    }
}

class LoginPage extends BasePage {
    @Override
    public void waitForPageLoad() {   // Overriding — dynamic binding
        System.out.println("Waiting for login form to render");
    }
}

public class BindingDemo {
    public static void main(String[] args) {
        BasePage page = new LoginPage(); // reference type: BasePage, actual object: LoginPage

        page.waitForPageLoad();   // Dynamic binding — JVM calls LoginPage's version at RUNTIME
                                   // Output: "Waiting for login form to render"

        page.waitForElement(null);        // Static binding — compiler picks this overload
        page.waitForElement(null, 10);    // Static binding — compiler picks this overload instead
    }
}
```

**Practical relevance in automation:** "This is exactly why calling an overridden method through a `BasePage` reference (as I do throughout the Page Object hierarchy) still correctly invokes the subclass's specific implementation at runtime — that's dynamic binding in action, and it's the mechanism that makes inheritance-based Page Object frameworks actually work."

---

### 10. Difference between a requirement and a user story in Agile methodology?

| Aspect | Requirement (traditional) | User Story (Agile) |
|--------|-------------------------------|--------------------------|
| Format | Formal, detailed specification document (e.g., "The system shall allow...") | Short, informal description from the user's perspective: *"As a [role], I want [goal], so that [benefit]"* |
| Level of detail | Comprehensive, fixed upfront (Waterfall-style) | Intentionally lightweight — details emerge through conversation and acceptance criteria |
| Ownership | Business Analyst writes it in full before development starts | Product Owner writes it collaboratively with the team; refined incrementally |
| Change tolerance | Changes go through formal change-control processes | Expected to evolve; re-prioritized every sprint via the backlog |
| Completion definition | Defined by the spec document itself | Defined by **Acceptance Criteria** attached to the story |

**Example:**

> **Requirement (traditional):** "The system shall allow a registered user to transfer funds between their own linked accounts, subject to available balance validation, with a maximum daily limit of ₹2,00,000, and shall log all transactions for audit purposes."

> **User Story (Agile):** "As a bank customer, I want to transfer money between my own accounts, so that I can manage my funds without visiting a branch."
> **Acceptance Criteria:**
> - Transfer fails if amount exceeds available balance
> - Transfer fails if daily limit (₹2,00,000) is exceeded
> - A successful transfer is reflected in both account balances immediately
> - Every transfer attempt (success or failure) is logged

**Interview-ready summary:** "A requirement tries to capture everything upfront in a formal document; a user story deliberately captures just enough to start a conversation, with the real detail living in the acceptance criteria that get refined as the team builds it. As a QA, I treat acceptance criteria as my primary source for test case design in Agile — they're effectively the 'definition of done' for that story."

---

### 11. What is a Jenkins CRON expression? How would you configure Jenkins to run automated tests after every commit?

**Jenkins CRON expression** — a 5-field schedule (`MINUTE HOUR DOM MONTH DOW`) used to trigger a job automatically at set times, most commonly for scheduled nightly regression runs.

```
H 2 * * *       → once daily, around 2 AM (H = hash, spreads load across the Jenkins master)
H/15 * * * *    → every ~15 minutes
0 9 * * 1-5     → 9:00 AM, Monday–Friday
```

*(See the Deloitte section above for a fuller breakdown of CRON syntax and why `H` is preferred over a fixed number.)*

**But "run tests after every commit" is NOT a CRON scheduling problem — it's a trigger problem, solved differently:**

**Option 1 — Poll SCM (CRON syntax, but polling for changes, not a fixed schedule):**
```
H/5 * * * *
```
This still uses CRON syntax, but instead of unconditionally running the job, Jenkins checks the repository every 5 minutes and **only triggers the build if new commits are found** — not a true "instant" trigger, but simple to set up with no dependency on the Git server.

**Option 2 — Webhook trigger (recommended, near-instant):**
1. In the Jenkins job config, enable **"GitHub hook trigger for GITScm polling"** (or the GitLab/Bitbucket equivalent)
2. In the GitHub/GitLab repo settings, add a **webhook** pointing to `http://<jenkins-url>/github-webhook/`
3. Every `git push` immediately notifies Jenkins via the webhook, which triggers the build **within seconds** — no polling delay at all

**Option 3 — Declarative Pipeline (Jenkinsfile), the modern standard approach:**
```groovy
pipeline {
    agent any
    triggers {
        githubPush() // triggers on every push via webhook
    }
    stages {
        stage('Checkout') {
            steps { git branch: 'main', url: 'https://github.com/org/automation-repo.git' }
        }
        stage('Run Tests') {
            steps { sh 'mvn clean test -DsuiteXmlFile=testng.xml' }
        }
    }
}
```

**Interview-ready summary:** "CRON is for *time-based* schedules — nightly full regression is the classic use case. 'Run on every commit' is a *webhook-based* trigger, which is near-instant and doesn't waste time polling. In practice, I'd use both in the same pipeline: a webhook trigger for fast smoke-test feedback on every push, and a CRON-scheduled nightly job for the full regression suite."

---

## Round 3: HR

### 1. What is your expected CTC?

**Approach, not a script:**
- Research the market rate for the role/location/experience level beforehand (Glassdoor, AmbitionBox, peer conversations) so the number is grounded, not guessed
- Give a **realistic range**, not a single rigid figure, and anchor it to your current CTC + a reasonable hike (commonly 20–40% depending on role change/company tier)
- If pressed for an exact number, state it confidently rather than deflecting indefinitely — indecision here can read as unpreparedness

**Sample answer:** "Based on my current CTC of ₹X LPA and the market range for this role and experience level, I'm looking at ₹Y–Z LPA. I'm open to discussing this further based on the complete compensation structure and the role's scope."

---

### 2. Can you relocate if required?

**Approach:** Answer honestly — a false "yes" to get through the interview creates a real problem later if the offer requires relocation you can't actually do.

**Sample answer (if genuinely flexible):** "Yes, I'm open to relocating for the right opportunity. I'd just need reasonable notice to plan the move."

**Sample answer (if there are constraints):** "I have some current constraints around relocating immediately, but I'm open to discussing timelines or remote/hybrid arrangements if that's flexible on your end."

---

### 3. Joining date discussion

**Approach:** Be precise about your actual notice period and any leave/buffer you genuinely need — don't commit to a date you can't hold, since a broken joining-date commitment reflects poorly at the very start of a new role.

**Sample answer:** "My official notice period is 60 days, but I can discuss an early release with my current employer. Realistically, I can commit to joining within 30–45 days from the offer date, and I'll confirm the exact date once I've had that conversation."

---

*Good luck with your interview preparation!*

---

## 9. Qualitest — QA Automation (3–5 YOE) Interview Questions

*Recently shared Qualitest QA Automation interview questions for a 3–5 years experience profile, spanning core Java/Selenium/Playwright fundamentals, framework & CI/CD design, and scenario-based debugging.*

---

## Round 1: Core Java, Selenium & Playwright

### 1. Difference between HashMap and ConcurrentHashMap?

| Aspect | HashMap | ConcurrentHashMap |
|---|---|---|
| Thread safety | Not thread-safe | Thread-safe |
| Locking | None | Segment/bucket-level locking (Java 8+ uses CAS + synchronized on bins) |
| Null keys/values | Allows one null key, multiple null values | Does not allow null keys or values |
| Performance under concurrency | Fails silently or throws `ConcurrentModificationException` during iteration if modified | Safe concurrent reads/writes without external synchronization |
| Iterator | Fail-fast | Fail-safe (weakly consistent, doesn't throw CME) |
| Use case | Single-threaded test data lookups | Shared state across parallel test threads (e.g., TestNG parallel execution, driver pools) |

```java
// In a parallel Selenium/Playwright framework, thread-local driver maps
// must use ConcurrentHashMap since multiple threads write simultaneously
private static final ConcurrentHashMap<Long, WebDriver> driverMap = new ConcurrentHashMap<>();

public static void setDriver(WebDriver driver) {
    driverMap.put(Thread.currentThread().getId(), driver);
}
```

> In our framework we run tests in parallel via TestNG, so any shared map (driver instances, test data cache) is a `ConcurrentHashMap` — a plain `HashMap` there would cause intermittent `ConcurrentModificationException` or corrupted buckets under load.

**Interview-ready summary:** "HashMap is fast but unsafe for concurrent access; ConcurrentHashMap achieves thread safety with fine-grained locking instead of locking the whole map, so I use it wherever test state is shared across parallel threads."

---

### 2. How do you handle StaleElementReferenceException?

This happens when the DOM re-renders (AJAX refresh, SPA re-render, page reload) after you've already located the element, so the underlying reference in the driver no longer maps to a live node.

- Re-locate the element instead of caching the `WebElement` reference — never hold a `WebElement` across an action that may trigger a re-render.
- Wrap the interaction in a retry loop with `ExpectedConditions.refreshed()`.
- Use a `FluentWait` with `StaleElementReferenceException` in the ignored-exceptions list so it auto-retries.
- In Page Object classes, prefer `@FindBy` with `PageFactory.initElements` (lazy proxy) or, better, method-based locators (`driver.findElement(...)` called fresh each time) rather than storing elements as fields resolved once.
- In Playwright this is largely a non-issue because `Locator` is lazy — it re-queries the DOM on every action, so there's no stale-element concept at all.

```java
public void clickWithRetry(By locator, int retries) {
    for (int i = 0; i < retries; i++) {
        try {
            driver.findElement(locator).click();
            return;
        } catch (StaleElementReferenceException e) {
            if (i == retries - 1) throw e;
        }
    }
}
```

**Interview-ready summary:** "StaleElementReferenceException means the DOM node behind my reference got replaced. I fix it by re-locating rather than caching, and by wrapping the click in a small retry/fluent-wait that specifically ignores this exception. In Playwright I don't worry about it since locators re-resolve on every call."

---

### 3. Implicit vs Explicit Wait – which do you prefer and why?

| Aspect | Implicit Wait | Explicit Wait |
|---|---|---|
| Scope | Applies globally to every `findElement` call | Applied to a specific element/condition |
| Condition | Only waits for presence in DOM | Can wait for visibility, clickability, text, custom conditions |
| Flexibility | Low — one fixed timeout for the whole driver | High — different timeouts/conditions per scenario |
| Mixing with explicit wait | Mixing both causes unpredictable wait times (known anti-pattern) | Safe to combine with `PageLoadTimeout` |

```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement submitBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("submit")));
submitBtn.click();
```

I prefer explicit waits (or `FluentWait` for polling control) almost exclusively. Implicit wait is set once globally, and Selenium's docs explicitly warn against mixing implicit + explicit because the two timers interact unpredictably and can inflate wait times to their sum in edge cases. Explicit waits let me wait for the actual condition I care about — clickable, invisible (for a spinner to disappear), text-to-be-present — rather than just "is it in the DOM."

**Interview-ready summary:** "I standardize on explicit waits with specific `ExpectedConditions` per element, and avoid implicit wait entirely to prevent the well-known mixed-wait timing bugs."

---

### 4. How does Selenium communicate with browsers?

```
Test Script (Java)
      │  (Selenium client bindings — JSON over HTTP)
      ▼
JSON Wire Protocol / W3C WebDriver Protocol
      │
      ▼
Browser Driver (chromedriver / geckodriver / msedgedriver)
      │  (browser-vendor-specific protocol, e.g., DevTools Protocol for Chrome)
      ▼
Actual Browser
```

- The test script issues commands via Selenium's client library, which serializes them as HTTP requests following the **W3C WebDriver protocol** (JSON payloads, REST-style endpoints like `POST /session/{id}/element`).
- Each browser has its own **driver executable** (chromedriver, geckodriver, msedgedriver) that acts as a server, listening for these HTTP requests.
- The driver translates the standardized WebDriver commands into the browser's native automation protocol (e.g., Chrome DevTools Protocol for Chromium-based browsers) and executes them.
- The browser performs the action and sends the result back up the same chain as an HTTP response.
- This is why Selenium needs a matching driver binary version for each browser version — the driver is the translation layer, and older/newer driver-to-browser mismatches break the protocol handshake.

**Interview-ready summary:** "Selenium talks WebDriver's W3C JSON protocol over HTTP to a browser-specific driver process, which converts it into the browser's own native protocol. That's why we're always pinning driver versions to browser versions."

---

### 5. Difference between findElement() and findElements()?

| Aspect | findElement() | findElements() |
|---|---|---|
| Return type | Single `WebElement` | `List<WebElement>` |
| Not found behavior | Throws `NoSuchElementException` | Returns an empty list |
| Use case | Unique element (submit button, header) | Multiple matches (table rows, list items, checking element existence) |
| Existence check | Requires try/catch to check presence | `.size() == 0` check — cleaner for "does this exist" logic |

```java
// Safe existence check without try/catch
boolean isErrorDisplayed = !driver.findElements(By.cssSelector(".error-msg")).isEmpty();

// Iterating multiple matches
List<WebElement> rows = driver.findElements(By.cssSelector("table tr"));
System.out.println("Row count: " + rows.size());
```

**Interview-ready summary:** "findElement throws if nothing matches, findElements never throws — it just gives back an empty list — so I use findElements whenever I need to check for optional/conditional elements without wrapping everything in try-catch."

---

### 6. How does Playwright auto-waiting work?

Playwright bakes actionability checks into every action API (`click()`, `fill()`, `check()`, etc.) instead of requiring explicit waits from the test author.

Before performing an action, Playwright automatically waits for the element to be:
- **Attached** to the DOM
- **Visible** (has non-empty bounding box, no `visibility:hidden`)
- **Stable** (not animating — same bounding box across two consecutive animation frames)
- **Enabled** (not `disabled`)
- **Receives events** (not obscured by another element on top of it, e.g., a modal overlay)
- For text-input actions, additionally **editable**

```javascript
// No explicit wait needed — Playwright waits for the button
// to be visible, stable, and enabled before clicking
await page.click('#submit');

// Auto-waiting also applies to assertions via web-first assertions,
// which retry until the condition is true or timeout hits
await expect(page.locator('.toast')).toBeVisible();
```

If any of these checks fail, Playwright retries until its default timeout (30s) elapses, then throws a detailed timeout error listing exactly which actionability check failed — which makes debugging far easier than a generic Selenium timeout.

**Interview-ready summary:** "Playwright doesn't need explicit waits for most actions because every action API auto-waits on a chain of actionability checks — attached, visible, stable, enabled, and not obscured — before firing the event. It only gives up and throws after its own retry timeout, and the error tells you exactly which check failed."

---

### 7. Locator vs ElementHandle in Playwright?

| Aspect | Locator | ElementHandle |
|---|---|---|
| Resolution | Lazy — re-queries the DOM every time an action is called | Eager — resolved once to a specific DOM node reference |
| Staleness | Never goes stale, auto-re-resolves | Can go stale if the DOM re-renders (same problem as Selenium's WebElement) |
| Auto-waiting | Full actionability auto-waiting built in | No auto-waiting — must be paired with manual waits |
| Recommended usage | Preferred/idiomatic Playwright API | Legacy/low-level, discouraged in new code |

```javascript
// Recommended: Locator — safe even if DOM re-renders between calls
const button = page.locator('#submit');
await button.click();

// Discouraged: ElementHandle — can become stale
const handle = await page.$('#submit');
await handle.click(); // fails if DOM changed since $() was called
```

**Interview-ready summary:** "Locator is the modern, recommended API — it's a lazy reference that re-resolves and auto-waits on every action, so it never goes stale. ElementHandle is the old eager-reference API that behaves like Selenium's WebElement and can go stale, so we've moved entirely to Locators in our framework."

---

### 8. How do you handle multiple tabs/windows?

**Selenium** — switch using window handles:
```java
String parentWindow = driver.getWindowHandle();
driver.findElement(By.linkText("Open in new tab")).click();

for (String handle : driver.getWindowHandles()) {
    if (!handle.equals(parentWindow)) {
        driver.switchTo().window(handle);
        break;
    }
}
// ... perform actions in new tab ...
driver.close();
driver.switchTo().window(parentWindow);
```

**Playwright** — listen for the `page` event on the browser context, which fires the moment a new tab/popup opens:
```javascript
const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.click('text=Open in new tab'),
]);
await newPage.waitForLoadState();
await newPage.click('#confirm');
await newPage.close();
```

Playwright's approach is more reliable because it's event-driven — you get the new `Page` object directly rather than polling `getWindowHandles()` and guessing which handle is new. It also avoids race conditions where the new window hasn't registered yet when you enumerate handles.

**Interview-ready summary:** "In Selenium I capture the handle set before and after the trigger action and diff them to find the new window. In Playwright I just await the `page` event on the browser context alongside the click — it hands me the new tab object directly, no polling needed."

---

### 9. Coding: Find the first non-repeated character in a string.

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class FirstNonRepeatedChar {

    public static Character findFirstNonRepeated(String input) {
        if (input == null || input.isEmpty()) return null;

        // LinkedHashMap preserves insertion order, so we can scan in original order
        Map<Character, Integer> frequency = new LinkedHashMap<>();

        for (char c : input.toCharArray()) {
            frequency.put(c, frequency.getOrDefault(c, 0) + 1);
        }

        for (Map.Entry<Character, Integer> entry : frequency.entrySet()) {
            if (entry.getValue() == 1) {
                return entry.getKey();
            }
        }
        return null; // no non-repeated character found
    }

    public static void main(String[] args) {
        System.out.println(findFirstNonRepeated("swiss"));      // w
        System.out.println(findFirstNonRepeated("aabbcc"));     // null
        System.out.println(findFirstNonRepeated("teeter"));     // r
    }
}
```

**Key points:**
- Time complexity: O(n) — one pass to build the frequency map, one pass to find the first count-1 entry.
- Space complexity: O(k) where k = number of distinct characters (bounded by charset size).
- `LinkedHashMap` is essential here — a plain `HashMap` does not guarantee iteration order, so the "first" non-repeated character could come back wrong.
- Edge cases handled: null/empty input returns null; string with all-repeated characters returns null.
- Alternative one-liner with streams is possible but less readable and doesn't improve complexity — I'd stick with this explicit version in an interview to show clear reasoning.

---

### 10. Coding: Find duplicate elements from a list using Java Streams.

```java
import java.util.*;
import java.util.stream.*;

public class DuplicateFinder {

    public static <T> Set<T> findDuplicates(List<T> list) {
        Set<T> seen = new HashSet<>();
        return list.stream()
                .filter(item -> !seen.add(item)) // add() returns false if already present
                .collect(Collectors.toSet());
    }

    // Alternative: using grouping + counting, useful if you also need the counts
    public static <T> Map<T, Long> findDuplicatesWithCount(List<T> list) {
        return list.stream()
                .collect(Collectors.groupingBy(item -> item, Collectors.counting()))
                .entrySet().stream()
                .filter(e -> e.getValue() > 1)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    public static void main(String[] args) {
        List<Integer> nums = List.of(1, 2, 3, 2, 4, 5, 1, 6);

        System.out.println(findDuplicates(nums));            // [1, 2]
        System.out.println(findDuplicatesWithCount(nums));    // {1=2, 2=2}
    }
}
```

**Key points:**
- `findDuplicates` runs in O(n) time using `Set.add()`'s O(1) average lookup as a side-effecting filter — a common, if slightly unconventional, stream idiom (some purists avoid mutating state inside `filter`, but it's a well-known, safe pattern for this exact use case since the stream is sequential).
- `findDuplicatesWithCount` uses `groupingBy` + `counting`, which is O(n) and also gives you frequency, useful for verifying "no duplicate test data IDs" type checks.
- For a strictly side-effect-free version, `Collectors.groupingBy(Function.identity(), Collectors.counting())` filtered by count > 1 is the safer stream-idiomatic choice — I mention both approaches to show I understand the trade-off between conciseness and stream purity.
- Works on any `List<T>` as long as `T` implements `equals()`/`hashCode()` correctly.

---

## Round 2: Framework, API & CI/CD

### 1. Explain your framework architecture.

- **Layered design**: Test layer (TestNG/JUnit test classes) → Page Object / Screenplay layer → Utility/Core layer (driver management, waits, reporting, API client) → Config layer (environment properties, test data).
- **Driver management**: `ThreadLocal<WebDriver>` (Selenium) or per-worker `BrowserContext` (Playwright) so parallel execution doesn't share state across threads.
- **Page Object Model** with a `BasePage` holding common actions (click, type, wait helpers) that every page object extends — keeps locators and page logic together, keeps test classes readable.
- **Data-driven layer**: test data externalized to JSON/Excel/YAML or a DB, loaded via a `TestDataProvider`, decoupled from test logic.
- **Reporting**: ExtentReports/Allure with screenshots-on-failure hooked into `@AfterMethod`/`ITestListener` (or Playwright's built-in trace/video/HTML report).
- **API layer**: RestAssured (or Playwright's `APIRequestContext`) for setting up state via API instead of UI where possible, and for hybrid UI+API assertions.
- **CI/CD integration**: Jenkinsfile/GitHub Actions workflow triggers the suite via Maven/npm, publishes reports as build artifacts, and gates the pipeline on pass/fail.
- **Config management**: environment-specific `.properties`/`.env` files selected via a `-Denv=qa` system property or CI variable, resolved through a single `ConfigReader` utility so no test class touches raw config directly.

This layering means a locator change only touches one page object, a reporting change only touches the listener, and adding a new environment is a config file, not a code change — which is exactly what an interviewer is probing for when they ask this.

---

### 2. Why Page Object Model? Any limitations?

**Why POM:**
- Separates locators/page interactions from test logic — a UI change touches one page class, not every test that uses that page.
- Improves readability — tests read like business steps (`loginPage.login(user, pass)`) instead of raw Selenium calls.
- Enables reuse across multiple test cases and even multiple test suites.
- Pairs naturally with Page Factory / lazy locator initialization.

**Limitations:**
- Can lead to bloated "God" page classes for large, complex pages (a 200-field form page becomes an unwieldy class) — mitigated by splitting into component objects (header, footer, modal as separate classes composed into the page).
- Doesn't model business workflows well on its own — a checkout flow spanning 5 pages needs an extra layer (Screenplay pattern or a "Flow"/"Task" object) on top of POM.
- Encourages a UI-only mental model; teams sometimes over-rely on POM even where an API call would set up state faster and more reliably.
- Static locators baked into page objects still break silently if a QA doesn't get advance notice of UI changes — POM organizes the pain but doesn't eliminate it.

> In practice I use POM as the base layer but add a thin "workflow" layer on top for multi-page business flows, and keep components (nav bar, modals) as separate reusable objects rather than duplicating locators across page classes.

---

### 3. How do you manage test data and configurations?

- **Environment configs**: separate `config-qa.properties`, `config-staging.properties`, `config-prod.properties`, selected at runtime via `-Denv=qa`, loaded once through a singleton `ConfigReader`.
- **Sensitive data**: credentials/API keys never committed — pulled from Jenkins credentials store / GitHub Actions secrets / a vault, injected as environment variables at runtime.
- **Test data**: 
  - Static reference data → JSON/YAML fixtures checked into the repo.
  - Dynamic data (unique emails, order IDs) → generated at runtime with libraries like JavaFaker/DataFaker to avoid data collisions in parallel runs.
  - Larger structured datasets → Excel/CSV read via Apache POI, or a dedicated test-data microservice/DB for integration-style suites.
- **Data-driven tests**: TestNG `@DataProvider` or JUnit 5 `@ParameterizedTest` pulling from the above sources, keeping the test method free of hardcoded values.
- **Isolation for parallel runs**: each thread/worker gets its own data set or uses randomized unique identifiers so tests don't collide on shared state (e.g., two parallel tests can't both try to register the same username).

```properties
# config-qa.properties
base.url=https://qa.myapp.com
api.base.url=https://qa-api.myapp.com
default.timeout=10
```

Why this matters: keeping config and data outside the code means the same test suite runs against QA, staging, or prod-like environments with zero code changes — just a different `-Denv` flag in the CI job.

---

### 4. How do you implement parallel execution in Selenium?

- **TestNG `parallel` attribute** in `testng.xml` — `methods`, `classes`, or `tests` level parallelism with a configurable `thread-count`.
```xml
<suite name="RegressionSuite" parallel="classes" thread-count="5">
```
- **ThreadLocal WebDriver** — each thread gets its own driver instance so parallel tests don't fight over the same browser session:
```java
private static ThreadLocal<WebDriver> driver = new ThreadLocal<>();

public static WebDriver getDriver() { return driver.get(); }
public static void setDriver(WebDriver d) { driver.set(d); }
```
- **Selenium Grid / cloud grid (BrowserStack, LambdaTest, Selenoid)** to distribute across multiple machines/browsers, not just multiple threads on one box.
- **Independent test data per thread** — as above, avoid shared mutable state (static counters, shared DB rows) across parallel tests.
- **CI-level sharding** — split the suite across multiple parallel Jenkins/GitHub Actions jobs/nodes in addition to in-process thread parallelism, for large suites.

Why this matters: without ThreadLocal isolation, "parallel" execution in Selenium silently degrades into flaky cross-talk between threads sharing one driver — this is the single most common root cause of "parallel tests are flaky" complaints.

---

### 5. How does Playwright handle parallel execution?

- **Workers, not just threads** — Playwright Test spins up multiple OS-level worker processes (`workers` config in `playwright.config.ts`), each with its own isolated browser instance, so there's no shared-state risk by design.
- **Test-file-level isolation** — by default, each test file runs in its own worker, and tests within a file run serially unless `test.describe.configure({ mode: 'parallel' })` is used.
- **Browser context isolation** — even within a worker, each test typically gets a fresh `BrowserContext` (like an incognito profile), so cookies/storage never leak between tests without needing manual driver-reset code.
```javascript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 4 : undefined, // undefined = auto (CPU cores)
  fullyParallel: true,
});
```
- **Sharding across CI machines** — `--shard=1/4` style flags split the total test list across multiple CI runners for horizontal scaling beyond one machine's worker count.
```bash
npx playwright test --shard=2/4
```

Why this matters: Playwright's process + context isolation removes the entire class of "shared driver state" bugs that plague hand-rolled Selenium parallelism — you get safe parallelism largely for free from the config, not from disciplined ThreadLocal usage.

---

### 6. How do you integrate automation with Jenkins/GitHub Actions?

**Jenkins (declarative pipeline):**
```groovy
pipeline {
    agent any
    tools { maven 'Maven3'; jdk 'JDK17' }
    parameters {
        choice(name: 'ENV', choices: ['qa', 'staging'], description: 'Target environment')
    }
    stages {
        stage('Checkout') { steps { git branch: 'main', url: 'https://repo-url.git' } }
        stage('Run Tests') {
            steps { sh "mvn clean test -Denv=${params.ENV} -Dsuite=regression.xml" }
        }
        stage('Publish Report') {
            steps {
                allure includeProperties: false, jdk: '', results: [[path: 'target/allure-results']]
            }
        }
    }
    post {
        always { junit 'target/surefire-reports/*.xml' }
        failure { mail to: 'team@company.com', subject: 'Build Failed', body: 'Check Jenkins console.' }
    }
}
```

**GitHub Actions:**
```yaml
name: Regression Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --shard=${{ matrix.shard }}
        strategy:
          matrix: { shard: [1/3, 2/3, 3/3] }
      - uses: actions/upload-artifact@v4
        if: always()
        with: { name: playwright-report, path: playwright-report/ }
```

Key practices: trigger on PR + scheduled nightly run, publish HTML/Allure reports as build artifacts, fail the build (non-zero exit) on test failure to block merges, and notify the team via Slack/email webhook on failure.

---

### 7. How do you perform API validation in UI tests?

- Use API calls to **set up preconditions** (create a user, seed an order) instead of doing it through slow UI flows — cuts test time dramatically and removes UI flakiness from data setup.
- Use API calls to **verify backend state** after a UI action — e.g., after submitting a form in the UI, hit the GET endpoint to confirm the record persisted correctly, rather than trusting only the UI confirmation toast.
- Validate **response schema, status codes, and key field values**, not just "200 OK."

```java
// RestAssured example: verify backend state after a UI action
given()
    .header("Authorization", "Bearer " + token)
.when()
    .get("/api/orders/" + orderId)
.then()
    .statusCode(200)
    .body("status", equalTo("CONFIRMED"))
    .body("items.size()", greaterThan(0));
```

```javascript
// Playwright's built-in APIRequestContext — no extra library needed
const response = await request.get(`/api/orders/${orderId}`);
expect(response.status()).toBe(200);
const body = await response.json();
expect(body.status).toBe('CONFIRMED');
```

Why this matters: hybrid UI+API validation catches bugs where the UI shows success but the backend state is actually wrong (or vice versa), and API-based setup/teardown makes the whole suite faster and less flaky since it bypasses unrelated UI steps.

---

### 8. How do you reduce flaky tests?

- Replace all hardcoded `Thread.sleep()` with explicit waits / Playwright's built-in auto-waiting.
- Use **API-based test data setup/teardown** instead of chaining UI steps, so a failure in an unrelated screen doesn't cascade into unrelated test failures.
- Ensure **test isolation** — no shared global state, unique test data per run (timestamps/UUIDs), fresh browser context per test.
- Stabilize locators — move away from brittle XPath/CSS tied to DOM structure toward `data-testid` attributes owned by the automation team.
- Add **retry-with-quarantine**, not blanket retries: retry a genuinely flaky test a bounded number of times in CI, but track retry counts and flag tests that need real fixes rather than silently green-washing them forever.
```javascript
// playwright.config.ts
retries: process.env.CI ? 2 : 0,
```
- Handle **environment flakiness** separately from test flakiness — network timeouts, third-party ad/analytics scripts, animations — by disabling animations in test mode and mocking unreliable third-party calls.
- Run a **flaky-test dashboard** (Allure/ReportPortal history, or a simple pass-rate tracker) to spot tests that fail intermittently over time, and treat repeated flakiness as a P2 bug, not noise.

Why this matters: flaky tests destroy trust in the suite — once people start ignoring red builds "because it's probably flaky," the whole safety net is gone, so flakiness has to be tracked and actively burned down, not just retried away.

---

### 9. How do you generate and manage test reports?

- **Allure Report** — rich HTML report with step-level breakdown, attachments (screenshots, request/response logs), history trend across builds, and categorization of failures (product bug vs. test bug vs. environment issue).
- **ExtentReports** — lighter-weight alternative, good for standalone HTML reports without a separate report server.
- **Playwright HTML Report** — built-in (`npx playwright show-report`), includes traces, videos, and screenshots per test out of the box; `trace: 'on-first-retry'` captures a full DOM/network trace only when needed to keep artifact size down.
- **Listeners/hooks** attach a screenshot automatically on failure:
```java
@AfterMethod
public void tearDown(ITestResult result) {
    if (result.getStatus() == ITestResult.FAILURE) {
        String path = ScreenshotUtil.capture(driver, result.getName());
        Allure.addAttachment("Failure Screenshot", new FileInputStream(path));
    }
    DriverManager.getDriver().quit();
}
```
- **CI publishing** — reports archived as build artifacts and, for Allure, served via a report history server (Jenkins Allure plugin) so trends are visible across builds, not just the latest run.
- **Failure categorization** — Allure's `categories.json` groups failures (assertion failure, timeout, product defect) so a triage meeting can scan by category instead of reading every stack trace.

Why this matters: a report that only says pass/fail is useless for triage — the report needs to answer "why did it fail" in under 30 seconds per test, which is what screenshots, traces, and categorized failures buy you.

---

### 10. How do you support multiple environments in your framework?

- **Externalized config per environment**: `config-<env>.properties` (or `.env.qa`, `.env.staging`) holding base URL, API endpoints, credentials references, timeouts.
- **Runtime selection**: `-Denv=staging` (Maven/TestNG) or `ENV=staging` env var (Playwright/Node), resolved by a single `ConfigReader`/`EnvironmentManager` utility — no test or page object ever hardcodes a URL.
```java
public class ConfigReader {
    private static Properties props = new Properties();
    static {
        String env = System.getProperty("env", "qa");
        try (InputStream in = new FileInputStream("src/test/resources/config-" + env + ".properties")) {
            props.load(in);
        } catch (IOException e) { throw new RuntimeException("Config load failed for env: " + env, e); }
    }
    public static String get(String key) { return props.getProperty(key); }
}
```
- **CI parameterization**: Jenkins `choice` parameter or GitHub Actions matrix (`env: [qa, staging]`) lets the same pipeline definition run against different targets without duplicating pipeline code.
- **Environment-aware test data**: some tests are environment-specific (e.g., feature-flagged in staging only) — tagged and conditionally skipped via `@Tag`/groups rather than hardcoded `if` checks scattered through tests.
- **Secrets management**: environment-specific credentials pulled from a secrets store (Jenkins credentials, GitHub Actions secrets, Vault) keyed by environment, never stored in the properties files themselves.

Why this matters: this design means promoting the same regression suite from QA to staging to a prod smoke-test tier is a one-line config change in the CI job, not a code change — which is exactly the kind of maintainability an interviewer is checking for.

---

## Round 3: Scenario-Based & Debugging

### 1. Test passes locally but fails in Jenkins. How will you debug?

```
1. Reproduce with same conditions
   → Run in headless mode locally (matches Jenkins) — many failures are headless-only
   → Match browser/driver version exactly to the CI agent

2. Check environment differences
   → Screen resolution / viewport size (CI agents often default to smaller viewports)
   → OS differences (fonts render differently → layout-dependent locators break)
   → Timezone/locale differences affecting date-formatted assertions

3. Check timing/performance differences
   → CI agents are often slower/resource-constrained → race conditions surface
     that don't show up on a fast local dev machine
   → Look for hardcoded sleeps or tight timeouts that assumed local-machine speed

4. Inspect CI artifacts
   → Pull the screenshot/video/trace captured on failure (should always be
     configured to capture on failure, not just locally)
   → Check console/network logs attached to the CI report

5. Check test isolation & execution order
   → Does the suite run in parallel on CI but sequentially locally?
   → Shared test data/state colliding only under CI's parallel workers

6. Check environment/config
   → Is CI pointing at a different environment URL, different test data,
     or missing an env var/secret that's present in the local shell?

7. Fix and verify
   → Reproduce the exact CI failure locally (headless + same viewport + same
     parallelism) before declaring it fixed — "works on my machine" isn't done
```

Concrete fixes I typically land on: switch from `Thread.sleep` to explicit waits (CI slowness exposes hardcoded sleeps first), pin a fixed viewport size in CI config, ensure headless mode is tested locally as a matter of course, and always wire up screenshot/trace capture on failure so I'm not debugging blind.

---

### 2. Dynamic locators keep changing after deployments. What is your approach?

- Push for **`data-testid`/`data-qa` attributes** owned by QA/automation, not tied to CSS classes or generated IDs — the single biggest fix, and worth raising with dev teams as a shared contract.
- Where stable attributes aren't available yet, use **relative/anchor-based locators** — locate by a stable nearby label/text and traverse (`xpath=//label[text()='Email']/following-sibling::input`) rather than by a generated class like `.css-1a2b3c`.
- Use **Playwright's built-in resilient locators** — `getByRole`, `getByLabel`, `getByText` — which target accessibility semantics rather than DOM structure/CSS, so they survive most styling/markup churn.
```javascript
// Resilient to markup changes since it targets role + accessible name
await page.getByRole('button', { name: 'Submit' }).click();
```
- Centralize locators in Page Objects so a change is a one-line fix in one place, not a hunt across the test suite.
- Add a **locator health-check job** — a lightweight scheduled job that verifies critical locators still resolve right after a deployment, catching breakage before the full regression suite runs and burns CI time on cascading failures.
- Negotiate a **"don't break test hooks" agreement** with dev teams — treat `data-testid` attributes like a versioned contract that shouldn't change without notice, same as an API contract.

Why this matters: this is fundamentally an org/process problem as much as a technical one — the technical fixes (stable attributes, semantic locators) only work long-term if paired with a process that flags UI changes to automation before they ship.

---

### 3. How do you automate OTP-based authentication?

- **Best option — bypass OTP in non-prod environments**: request a test-mode flag/backdoor from dev/backend (e.g., a fixed OTP like `000000` for whitelisted test accounts, or an env-specific config that disables OTP for automation users). This is the most reliable and fastest approach and should be pushed for first.
- **Email-based OTP**: use a test mailbox with an API (Mailosaur, Mailinator API, or a Gmail API service account) to programmatically fetch the OTP email and parse it — no manual/UI email checking.
```java
String otp = mailosaurClient.getLatestMessage(serverId)
                            .getBody()
                            .extractOtpUsingRegex("\\d{6}");
```
- **SMS-based OTP**: use a virtual number provider with an API (Twilio test numbers, or an internal SMS-gateway sandbox) that exposes received messages via API for parsing, same pattern as email.
- **TOTP-based 2FA** (Google Authenticator style, not SMS OTP): if the app uses TOTP, generate the code directly in the test using the shared secret and a TOTP library — fully deterministic, no external service needed.
```java
GoogleAuthenticator gAuth = new GoogleAuthenticator();
int code = gAuth.getTotpPassword(sharedSecretKey);
```
- **Avoid** trying to automate reading OTP off a real personal phone/SMS inbox via UI — it's slow, flaky, and not scalable across parallel runs.

Why this matters: this question is really testing whether you know to push for a test-mode backdoor first rather than over-engineering a fragile email/SMS-scraping pipeline — the simplest reliable option should always be pursued before the complex one.

---

### 4. How would you optimize a suite taking 2+ hours to execute?

- **Parallelize** — increase thread-count/workers, and shard across multiple CI machines (`--shard` in Playwright, multiple Jenkins agents for Selenium Grid) rather than just one box with more threads.
- **Cut UI-driven setup** — replace UI login/data-seeding steps with direct API calls; this alone often cuts significant time since setup steps run before every single test.
- **Right-size the suite** — separate **smoke** (fast, run on every PR), **regression** (full suite, nightly), and **critical-path** tiers so not every change waits on the full 2-hour run.
- **Eliminate redundant waits** — audit for `Thread.sleep()` and overly generous fixed timeouts; replace with condition-based waits that return as soon as the condition is true instead of always waiting the max.
- **Reuse browser/session state** where safe — e.g., `storageState` in Playwright to skip repeated login flows across independent tests that don't need a fresh session:
```javascript
// Save once
await page.context().storageState({ path: 'auth.json' });
// Reuse in other tests
const context = await browser.newContext({ storageState: 'auth.json' });
```
- **Identify and fix the slowest tests** — profile execution time per test (most reporting tools show this), and target the worst 10% rather than micro-optimizing everything equally.
- **Headless execution** in CI (already faster than headed) and disable unnecessary browser features (extensions, animations) during test runs.
- **Remove/consolidate duplicate coverage** — overlapping tests covering the same path from slightly different angles add time without adding much confidence.

Why this matters: a 2-hour suite blocks fast feedback on every PR — the goal isn't just "make it faster" but restructuring so the fast feedback loop (smoke) is separate from the thorough safety net (nightly regression).

---

### 5. An element is visible but not clickable. How do you investigate?

```
1. Check for an overlapping element
   → Another element (modal backdrop, sticky header, toast, ad banner)
     sits on top of it in the z-index stack even though the target itself
     looks visible on screen
   → In Playwright, the "receives events" actionability check fails and the
     error message names the intercepting element directly — read it

2. Check if it's outside the viewport
   → Element exists and is "visible" in the DOM sense but is below the fold
     or behind a fixed header — scrollIntoView first

3. Check for animation/transition in progress
   → Element's position/opacity is still animating when the click fires
   → Playwright's "stable" check should catch this, but Selenium has no
     equivalent — add a short wait for animation-end or disable animations
     in the test environment

4. Check if it's actually disabled or read-only
   → Visually looks enabled (CSS styling) but has a disabled attribute
     or a pointer-events: none style rule

5. Check iframe context
   → Element lives inside an iframe and the driver hasn't switched into
     that frame's context yet — Selenium requires an explicit
     driver.switchTo().frame(); Playwright's frameLocator() handles this

6. Reproduce manually with DevTools
   → Open DevTools, inspect computed styles for pointer-events, z-index,
     opacity; use the "what's covering this element" trick by clicking at
     that exact coordinate manually
```

Concrete fixes: `scrollIntoView()` before click, explicit wait on `elementToBeClickable` (Selenium) or trust Playwright's actionability + read its error for the blocking element, switch frame context if needed, or use `.click({ force: true })` in Playwright only as a last resort — and if forcing is needed, flag it because it usually signals a legitimate UX/z-index bug worth reporting to dev, not just a test workaround.

---

### 6. How do you identify whether a failure is application or automation related?

- **Read the actual error first** — an assertion failure with a clear expected-vs-actual mismatch is a strong signal of a real app bug; a timeout/`NoSuchElementException`/`StaleElementReferenceException` leans toward an automation/locator/timing issue, though not always.
- **Check the screenshot/video/trace at the point of failure** — does the UI show an error toast, a 500 page, unexpected data? That points to the app. Does the UI look correct but the test still failed to find/click something? That points to automation.
- **Reproduce manually** — perform the same steps by hand in the same environment; if the bug reproduces manually, it's an application defect, full stop.
- **Check API/network logs** — a failed backend call (4xx/5xx in the network trace) confirms an application-layer issue independent of the UI automation code.
- **Check test history** — has this test been consistently flaky/red regardless of app changes (points to automation/environment) or did it start failing right after a specific deployment (points to a regression in the app)?
- **Cross-reference with recent changes** — check the deployment/release notes for the environment; a locator/element that "used to be there" often correlates with a recent UI change ticket.
- **Isolate the layer** — if UI test fails, hit the same operation via API directly; if the API also fails, it's confirmed application-side, not a UI-automation quirk.

Why this matters: mislabeling a real app bug as "flaky test" (or vice versa) either lets a genuine regression slip to production or wastes dev time chasing a phantom bug — this triage step is where automation earns credibility with the dev team.

---

### 7. How do you stabilize highly flaky tests?

- **Quarantine first, fix second** — move confirmed-flaky tests to a separate "quarantine" suite that doesn't block the pipeline, so they stop eroding trust in the main run while being actively fixed, not ignored forever.
- **Root-cause each one individually** — flaky tests are rarely flaky for the same reason; run the specific failing test 20-50 times in a loop locally/CI to reproduce and capture the failure pattern before attempting a fix.
```bash
# Playwright: repeat a single test to reproduce intermittent failure
npx playwright test tests/checkout.spec.ts --repeat-each=30
```
- **Common root causes to check systematically**: race conditions from missing waits, animation timing, network-dependent third-party widgets, shared test data colliding under parallel execution, timezone/locale-dependent assertions, and test-order dependency (a test that only fails when run after a specific other test).
- **Replace brittle waits** with condition-based waits/auto-waiting, and disable animations/transitions in the test environment via CSS override.
- **Isolate test data** — unique identifiers per test run (UUID/timestamp) to eliminate collisions under parallel execution.
- **Mock unreliable externals** — third-party payment widgets, ad scripts, analytics beacons — stub these at the network layer so their instability doesn't leak into your suite's stability.
- **Track flakiness metrics over time** (pass-rate per test in Allure/ReportPortal history) to confirm a fix actually worked rather than assuming it did after one green run.

Why this matters: "just add a retry" treats the symptom; the goal is a suite where retries are rarely needed at all, because every retry masks a potential real timing bug that could just as easily bite a real user.

---

### 8. How would you increase automation coverage in a legacy project?

- **Risk-based prioritization first** — map existing manual test cases to business-critical flows (revenue-impacting, high-traffic, high-defect-history areas) and automate those first, not whatever's easiest.
- **Start with API-level tests** where possible — faster to write, faster to run, and often uncovers a lot of validation logic that would otherwise need slow UI coverage.
- **Introduce a proper framework incrementally** — if legacy automation exists as unstructured scripts, refactor into POM/data-driven structure test-by-test as you touch them, rather than a risky big-bang rewrite.
- **Add stable test hooks to the legacy UI as you go** — push for `data-testid` attributes on the pages you're actively automating, rather than fighting brittle legacy locators everywhere at once.
- **Set an incremental coverage target tied to releases** — e.g., "every new feature ships with automated regression coverage" (stops the gap from growing) plus a fixed weekly/sprint budget to backfill legacy coverage (shrinks the gap over time).
- **Leverage existing manual test cases as the spec** — legacy manual test scripts are often the best source of truth for what "coverage" should include; don't automate from scratch without consulting them.
- **Track coverage visibly** — a simple dashboard mapping features to automated/manual/none status keeps the initiative visible to stakeholders and prevents effort from being deprioritized.

Why this matters: legacy coverage gaps rarely get fixed via a heroic one-time effort — the sustainable pattern is "stop the bleeding" (new features always automated) combined with a steady backfill cadence.

---

### 9. How do you handle file uploads/downloads in headless execution?

**Uploads:**
```java
// Selenium: send file path directly to the <input type="file"> element,
// no OS file dialog interaction needed — works fine headless
driver.findElement(By.id("fileInput")).sendKeys("/absolute/path/to/file.pdf");
```
```javascript
// Playwright: setInputFiles works the same way, headless or not
await page.setInputFiles('#fileInput', '/absolute/path/to/file.pdf');
```
Neither tool ever touches the native OS file picker dialog — both bypass it entirely by setting the file input's value directly via the automation protocol, which is exactly why this works identically in headless mode.

**Downloads:**
```java
// Selenium: configure Chrome to auto-download to a known directory
// without a "Save As" prompt, then poll the filesystem
ChromeOptions options = new ChromeOptions();
Map<String, Object> prefs = new HashMap<>();
prefs.put("download.default_directory", "/absolute/download/dir");
prefs.put("download.prompt_for_download", false);
options.setExperimentalOption("prefs", prefs);
```
```javascript
// Playwright: has built-in download event handling, no browser config needed
const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#downloadBtn'),
]);
await download.saveAs('/absolute/download/dir/' + download.suggestedFilename());
```
- After download, verify file existence, size > 0, and optionally content (checksum, or open a PDF/CSV and assert on parsed content) rather than just "did a file appear."
- Always clean up the download directory before/after each test run to avoid stale files causing false positives on existence checks.

Why this matters: the key insight interviewers are checking for is that file dialogs are never actually automated by either tool — both frameworks intercept at the browser/API level, which is precisely what makes this work identically headless or headed.

---

### 10. What would be your strategy for testing a critical release under tight timelines?

- **Risk-based test selection** — run a tightly scoped smoke + critical-path regression suite covering revenue/security/high-traffic flows first, not the full multi-hour regression suite.
- **Parallelize aggressively** — max out CI worker/shard count for this run specifically, even beyond the normal daily-run configuration, to get the fastest possible signal.
- **Shift left where still possible** — if any window remains before the freeze, prioritize testing the actual delta (changed files/features) via git diff against the last release, not the whole app equally.
- **Hybrid manual + automated** — run automation for repeatable/regression coverage in parallel with manual exploratory testing focused specifically on the new/changed functionality, since automation on brand-new features may not exist yet.
- **API-level sanity checks first** — fast health checks against critical endpoints before investing time in full UI flows, to fail fast if something fundamental is broken.
- **Clear go/no-go criteria agreed in advance** — define with stakeholders which failures are release blockers vs. acceptable-with-followup-ticket, before testing starts, so a tight timeline doesn't turn into an ad-hoc argument at go-live time.
- **Post-release monitoring plan as a safety net** — feature flags/canary rollout plus close monitoring of error rates/logs immediately after release, treating the release itself as an extension of the test strategy when timelines don't allow full pre-release coverage.
- **Communicate residual risk explicitly** — document what wasn't covered due to time constraints so the decision to ship is an informed one, not a silent gap.

Why this matters: under a tight timeline the job isn't to test everything faster — it's to make a deliberate, communicated trade-off about what gets tested now versus monitored after release, so the team ships with eyes open rather than false confidence.

---

## 10. LTIMindtree — SDET / Automation Interview Questions (25 LPA)

*Recently shared LTIMindtree SDET / QA Automation interview questions for a 25 LPA role — spanning BDD (Cucumber), CI/CD, Page Object Model, Playwright architecture, and Selenium 4 internals. The interviewer's follow-up pattern was explicitly "you know the tool — now explain what happens internally."*

---

### 1. What is the purpose of a Test Runner in Cucumber?

The Test Runner is the entry point that glues together three things: the `.feature` files (Gherkin), the step definition classes (Java), and the reporting/execution configuration. Without it, Cucumber has no idea where your features live or how to bind steps to code.

In Java, it's a JUnit (or TestNG) class annotated to bootstrap Cucumber:

```java
import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import org.junit.runner.RunWith;

@RunWith(Cucumber.class)
@CucumberOptions(
    features = "src/test/resources/features",
    glue = {"stepdefinitions", "hooks"},
    tags = "@regression and not @wip",
    plugin = {
        "pretty",
        "html:target/cucumber-reports/report.html",
        "json:target/cucumber-reports/report.json"
    },
    monochrome = true
)
public class TestRunner {
}
```

- `features` — where Gherkin files are picked up from.
- `glue` — packages containing step definitions and hooks.
- `tags` — filters which scenarios actually run (CI often runs `@smoke`, nightly runs `@regression`).
- `plugin` — wires in report generators (pretty console output, HTML, JSON for downstream tools like Jenkins/ExtentReports).

> **Interview-ready summary:** "The Test Runner is Cucumber's orchestrator — it tells the framework where the features are, where the glue code is, which tags to include, and how to report results. JUnit/TestNG just triggers it; Cucumber does the actual BDD execution underneath."

---

### 2. What is the purpose of Background in Cucumber?

`Background` runs a common set of steps before **every** scenario in a feature file — it's the Gherkin equivalent of a `@BeforeEach`/`@BeforeMethod`, but declared at the feature level so it's visible to non-technical stakeholders reading the spec.

```gherkin
Feature: Order checkout

  Background:
    Given the user is logged in
    And the cart has at least one item

  Scenario: Apply a valid coupon
    When the user applies coupon "SAVE10"
    Then the order total should reflect a 10% discount

  Scenario: Apply an expired coupon
    When the user applies coupon "EXPIRED5"
    Then an error message "Coupon expired" should be displayed
```

**Key points:**
- Runs before each `Scenario`/`Scenario Outline` in that feature, not once for the whole file.
- Keeps feature files DRY — avoids repeating login/setup steps in every scenario.
- Should stay short (2-4 steps); if it grows large, it's usually a sign the feature file is trying to cover too much and should be split.

---

### 3. What is a Scenario Outline and when do you use it?

`Scenario Outline` runs the same sequence of steps multiple times with different data, pulled from an `Examples` table. Use it whenever you'd otherwise copy-paste a scenario and only change the input/expected values — classic data-driven testing.

```gherkin
Scenario Outline: Login with different credential combinations
  Given the user is on the login page
  When the user enters username "<username>" and password "<password>"
  Then the login result should be "<result>"

  Examples:
    | username      | password   | result           |
    | validUser     | validPass  | Login Successful |
    | validUser     | wrongPass  | Invalid Password |
    | unknownUser   | validPass  | User Not Found   |
    | ""            | validPass  | Username Required|
```

Each row in `Examples` produces one independent scenario execution — Cucumber reports them individually (e.g., "Login with different credential combinations -- @1.1", "@1.2" etc.), so a failure in one row doesn't hide failures in others.

> **Interview-ready summary:** "Scenario Outline plus Examples is Cucumber's data-driven testing mechanism — one template scenario, many rows of data, each row treated and reported as its own scenario run."

---

### 4. How do you generate reports in Cucumber?

Three common layers, and I've used all three depending on the project's CI maturity:

| Approach | How | Best for |
|---|---|---|
| Built-in plugins | `plugin = {"html:...", "json:..."}` in `@CucumberOptions` | Quick local runs, no extra dependency |
| Cucumber JSON + external reporter | Generate `cucumber.json`, feed it to **Masterthought / Cucumber Reports (net.masterthought)** or **ExtentReports** via a Maven plugin | Rich HTML dashboards with pass/fail trends, screenshots |
| CI-native | Jenkins **Cucumber Reports plugin** reads the JSON and renders trend graphs across builds | Team visibility, historical pass-rate tracking |

```xml
<!-- Maven plugin to convert cucumber.json into a rich HTML report -->
<plugin>
    <groupId>net.masterthought</groupId>
    <artifactId>maven-cucumber-reporting</artifactId>
    <version>5.7.6</version>
    <executions>
        <execution>
            <id>execution</id>
            <phase>verify</phase>
            <goals><goal>generate</goal></goals>
            <configuration>
                <projectName>checkout-automation</projectName>
                <outputDirectory>${project.build.directory}/cucumber-html-reports</outputDirectory>
                <jsonFiles>
                    <param>**/cucumber-reports/*.json</param>
                </jsonFiles>
            </configuration>
        </execution>
    </executions>
</plugin>
```

**Key points:**
- I typically add a screenshot-on-failure hook (`@AfterStep`) and embed it into the JSON/Extent report so failures are debuggable without re-running.
- In Jenkins, publish the `cucumber-html-reports` directory as a post-build HTML report so it's a click away from the build page.

---

### 5. What are Cron Jobs?

A cron job is a time-based scheduler on Unix-like systems that runs a command/script at fixed intervals defined by a 5-field cron expression: `minute hour day-of-month month day-of-week`.

```bash
# crontab -e
# ┌───────────── minute (0-59)
# │ ┌───────────── hour (0-23)
# │ │ ┌───────────── day of month (1-31)
# │ │ │ ┌───────────── month (1-12)
# │ │ │ │ ┌───────────── day of week (0-6, Sun=0)
# │ │ │ │ │
  0 2 * * *  /home/jenkins/scripts/run-regression.sh >> /var/log/regression.log 2>&1
```

That entry runs the regression suite every night at 2 AM.

In automation, cron shows up in two places:
- **Jenkins build triggers** use the same cron syntax (`H 2 * * *` — the `H` lets Jenkins spread load instead of every job firing at exactly 2:00:00) to schedule nightly/weekly regression runs without a human clicking "Build Now".
- Standalone Linux boxes running scheduled health checks, log rotation, or data cleanup scripts that support the test environment.

---

### 6. What is a Scripted Pipeline in Jenkins?

Scripted Pipeline is the original, Groovy-based way of writing Jenkins pipelines-as-code — full imperative Groovy syntax wrapped in a single `node { }` block, as opposed to **Declarative Pipeline** (the newer, structured `pipeline { stages { } }` DSL with stricter syntax).

```groovy
node {
    def mvnHome
    stage('Checkout') {
        git branch: 'main', url: 'https://github.com/org/automation-suite.git'
    }
    stage('Build') {
        mvnHome = tool 'Maven-3.9'
        sh "'${mvnHome}/bin/mvn' clean compile"
    }
    stage('Test') {
        try {
            sh "'${mvnHome}/bin/mvn' test -Dcucumber.filter.tags='@regression'"
        } catch (err) {
            currentBuild.result = 'UNSTABLE'
        } finally {
            junit '**/target/surefire-reports/*.xml'
            cucumber '**/target/cucumber-reports/*.json'
        }
    }
    stage('Notify') {
        if (currentBuild.result == 'UNSTABLE') {
            slackSend channel: '#qa-alerts', message: "Regression suite unstable: ${env.BUILD_URL}"
        }
    }
}
```

**Key points:**
- Full Groovy power — loops, conditionals, try/catch, custom functions — because it's real Groovy code, not a restricted DSL.
- Harder to read/maintain at scale and less friendly to Blue Ocean visualization than Declarative.
- Declarative is preferred for most teams today; Scripted is still used when you need dynamic stage generation or complex conditional logic that Declarative's `script {}` escape hatch makes awkward.

---

### 7. How do you handle Git conflicts?

My process is always the same: understand *why* the conflict happened before resolving it, don't just pick a side blindly.

```bash
# 1. Pull latest and see the conflicting files
git pull origin main
# CONFLICT (content): Merge conflict in src/test/java/pages/LoginPage.java

# 2. Inspect the conflict markers
git status
git diff

# 3. Open the file — Git marks the conflicting regions:
<<<<<<< HEAD
    driver.findElement(By.id("username")).sendKeys(user);
=======
    driver.findElement(By.name("username")).sendKeys(user);
>>>>>>> feature/login-locator-fix

# 4. Manually resolve — decide which locator is correct (or merge both),
#    then remove the <<<<<<<, =======, >>>>>>> markers

# 5. Mark as resolved and continue
git add src/test/java/pages/LoginPage.java
git commit -m "Resolve merge conflict: use name locator for username field"

# For an in-progress rebase instead of merge:
git rebase --continue
# or abort entirely if it's too messy:
git rebase --abort
```

**Key points:**
- Always run the test file locally after resolving before pushing — a syntactically clean merge can still be logically wrong.
- For Page Object files specifically, conflicts usually mean two people updated locators independently — I check with whoever made the other change instead of guessing.
- `git mergetool` (e.g., configured with VS Code or Meld) is worth setting up for frequent conflicts — it's far easier to reason about side-by-side than raw markers.

---

### 8. What is Page Object Model and why do we use it?

Page Object Model (POM) is a design pattern where each web page (or major component) is represented by a class that encapsulates its locators and the actions you can perform on it. Test/step-definition code talks to the page object, never directly to `driver.findElement(...)` or Playwright's `page.locator(...)`.

```java
public class LoginPage {
    private final Page page;

    private final Locator username;
    private final Locator password;
    private final Locator loginButton;

    public LoginPage(Page page) {
        this.page = page;
        this.username = page.locator("#username");
        this.password = page.locator("#password");
        this.loginButton = page.locator("button[type='submit']");
    }

    public void login(String user, String pass) {
        username.fill(user);
        password.fill(pass);
        loginButton.click();
    }
}
```

**Why we use it:**
- **Single source of truth for locators** — if the UI changes an id/class, you fix it in one place instead of across dozens of test files.
- **Readable tests** — `loginPage.login(user, pass)` reads like a business action, not a sequence of DOM queries.
- **Reusability** — the same page object is used across smoke, regression, and BDD step definitions.
- **Separation of concerns** — test logic (assertions, flow) stays separate from UI interaction logic (locators, waits).

> **Interview-ready summary:** "POM decouples 'what the test does' from 'how the UI is structured' — locators live in one class per page, tests call intention-revealing methods on that class. It's the single biggest thing that keeps a large automation suite maintainable as the UI evolves."

---

### 9. What is Browser Context in Playwright?

A `BrowserContext` is an isolated, incognito-like browser session created from a single `Browser` instance — separate cookies, local storage, sessions, and permissions per context, but all contexts share the same underlying browser process, which is what makes them cheap to spin up.

```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();

  // Two fully isolated "users" from one browser process
  const adminContext = await browser.newContext();
  const guestContext = await browser.newContext();

  const adminPage = await adminContext.newPage();
  const guestPage = await guestContext.newPage();

  await adminPage.goto('https://example.com/login');
  await guestPage.goto('https://example.com/login');

  // adminContext's login cookies never leak into guestContext
  await adminContext.close();
  await guestContext.close();
  await browser.close();
})();
```

**Key points:**
- This is how Playwright achieves **parallel, isolated test execution without launching a new browser per test** — a huge speed win over Selenium, where isolation usually means a brand-new WebDriver session (and often a new browser process).
- Contexts can be pre-configured with viewport, geolocation, permissions, storage state (for auth reuse via `storageState`), and HTTP headers — great for multi-role testing (admin vs. guest) in the same run.
- Closing a browser closes all its contexts; closing a context doesn't affect the browser or sibling contexts.

---

### 10. Why is Playwright faster than Selenium?

| Aspect | Selenium | Playwright |
|---|---|---|
| Protocol | W3C WebDriver — HTTP request/response per command | CDP/WebSocket (bidirectional, persistent connection) |
| Communication | Each command is a new HTTP call to the driver, which forwards it to the browser | Single persistent WebSocket connection; commands and events flow both ways with no per-call HTTP overhead |
| Waiting | Explicit/implicit waits you configure manually (`WebDriverWait`) | Built-in **auto-waiting** — actions wait for the element to be actionable (visible, stable, enabled) before acting |
| Browser control | Driver executable (chromedriver/geckodriver) as a middleman process | Talks (mostly) directly to the browser engine via its own protocol, or a thin driver layer bundled with the browser binaries Playwright installs |
| Context isolation | New session = new browser/driver process typically | New `BrowserContext` from one browser process — near-instant |
| Network interception | Needs a proxy (BrowserMob Proxy etc.) | Native `page.route()` — no extra tooling |

```javascript
// Auto-waiting example — no explicit wait needed
await page.click('#submit'); // Playwright waits for visible+enabled+stable automatically
```

> **Interview-ready summary:** "Playwright is faster mainly because of the protocol and the waiting model — it keeps one persistent WebSocket connection to the browser instead of firing a new HTTP request per command like WebDriver, and it auto-waits for elements to be actionable instead of relying on sleeps or manual waits. On top of that, spinning up an isolated BrowserContext is far cheaper than spinning up a whole new browser session."

---

### 11. Explain Playwright architecture.

Playwright's architecture is fundamentally different from Selenium's client-server model — there's no separate driver executable per browser vendor.

```
Test Script (Node.js/Java/Python/.NET)
        │
        │  Playwright API calls
        ▼
Playwright Library (per-language bindings)
        │
        │  single WebSocket connection
        ▼
Playwright Driver (Node.js process, launched under the hood)
        │
        │  browser-specific protocol:
        │   - Chromium → CDP (Chrome DevTools Protocol)
        │   - Firefox  → patched Juggler protocol
        │   - WebKit   → patched WebKit remote debug protocol
        ▼
Browser Process (Chromium / Firefox / WebKit)
```

**Key architectural points:**
- Playwright ships **patched builds** of Firefox and WebKit (and uses Chromium's native CDP) so it gets low-level, reliable automation hooks that aren't officially exposed for automation in stock builds.
- Everything runs over a **single WebSocket** — Playwright can both send commands and *receive events* (console logs, network requests, dialogs, page navigation) in real time, which is what enables features like `page.waitForResponse()`, request interception, and auto-waiting.
- Language bindings (Java, Python, .NET, JS) all talk to the **same underlying Node.js driver process** via this protocol — meaning feature parity across languages is much easier to maintain than with Selenium, where each language binding implements the W3C protocol independently.
- Multiple `BrowserContext`s (and multiple `Page`s per context) run inside one `Browser` process, giving cheap parallelism/isolation as covered above.

---

### 12. Does Playwright use WebDriver?

No — this trips a lot of people up. Playwright does **not** implement or rely on the W3C WebDriver protocol at all. It has its own architecture that talks to browsers using each engine's native automation protocol:

- **Chromium** → CDP (Chrome DevTools Protocol) directly.
- **Firefox** → a patched build exposing an internal protocol (based on Juggler).
- **WebKit** → a patched build exposing WebKit's own remote debugging protocol.

This is precisely *why* Playwright doesn't need separate driver binaries like `chromedriver.exe` / `geckodriver.exe` that you must download and version-match — `npx playwright install` downloads browser builds that already speak the protocol Playwright needs, bundled together.

> **Interview-ready summary:** "No — Playwright deliberately bypasses WebDriver. It talks to Chromium over CDP and to patched Firefox/WebKit builds over their own debug protocols, all through one persistent WebSocket. That's the core reason it doesn't need a separate driver executable and why it can do things WebDriver-based tools can't, like true network interception and multi-tab/context handling out of the box."

---

### 13. What are Browser, BrowserContext, Page and Locator in Playwright?

They form a strict containment hierarchy:

```
Browser  →  BrowserContext  →  Page  →  Locator
(process)   (isolated session) (tab)    (element reference)
```

| Object | What it represents | Typical usage |
|---|---|---|
| `Browser` | A running instance of Chromium/Firefox/WebKit | `const browser = await chromium.launch()` — usually one per test run/worker |
| `BrowserContext` | An isolated session within that browser (own cookies, storage, permissions) | `const context = await browser.newContext()` — one per test for isolation |
| `Page` | A single tab/page within a context | `const page = await context.newPage()` — where navigation and most actions happen |
| `Locator` | A lazy, auto-retrying reference to element(s) matching a selector — not resolved until an action is performed | `const btn = page.locator('button.submit')` |

```javascript
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

await page.goto('https://example.com');
const loginBtn = page.locator('#login');   // Locator: not queried yet
await loginBtn.click();                    // resolved + auto-waited + acted on here
```

**Key points:**
- `Locator` is deliberately lazy — it re-queries the DOM every time an action runs, which is why Playwright handles dynamically re-rendered elements (React/Angular re-renders) without the classic Selenium `StaleElementReferenceException`.
- This hierarchy is exactly what makes parallel, isolated tests cheap: many `Page`s per `BrowserContext`, many `BrowserContext`s per `Browser`, without relaunching the browser process each time.

---

### 14. Explain Selenium 4 architecture.

```
Test Script
     │  Selenium client bindings (Java/Python/JS/.NET)
     ▼
JSON payload over HTTP, per W3C WebDriver spec
     ▼
Browser Driver (chromedriver / geckodriver / msedgedriver)
     │  translates W3C commands into browser-native automation calls
     ▼
Browser (Chrome / Firefox / Edge / Safari)
```

**How it works step by step:**
1. Your test calls a Selenium API method, e.g. `driver.findElement(By.id("username")).sendKeys("sriram")`.
2. The client binding serializes this into a **W3C WebDriver-compliant JSON payload** and sends it as an HTTP request to the browser driver's local server (e.g., chromedriver listening on `localhost:9515`).
3. The driver translates that JSON command into the browser's native automation protocol calls — for Chrome, chromedriver internally uses CDP to control the browser.
4. The browser executes the action and returns a result, which flows back up through the driver → HTTP response → client binding → your test.

**What's new in Selenium 4 specifically:**
- The protocol is now **natively W3C WebDriver** end to end (Selenium 3 used the legacy JSON Wire Protocol and only partially supported W3C, requiring translation layers that caused flakiness).
- **Native CDP support** — you can now do `((HasCdp) driver)` style access (via `DevTools` class) for network interception, console log capture, geolocation override, without a proxy tool.
- **Relative locators** (`RelativeLocator.with(By.tagName("input")).above(...)`) for DOM-relationship-based element finding.
- Selenium Grid rewritten with better observability (a proper UI, Docker support, auto-detection of drivers via Selenium Manager).

---

### 15. What is the W3C WebDriver protocol?

It's a **W3C-standardized REST/HTTP protocol** that defines how a test client talks to a browser driver to remotely control a browser — a formal specification (not just Selenium's internal convention) that any tool can implement.

```
Client                          Driver (chromedriver etc.)
  │  POST /session                    │
  │  { "capabilities": {...} }        │
  │ ─────────────────────────────────>│
  │                                   │  starts browser, returns sessionId
  │ <─────────────────────────────────│
  │  POST /session/{id}/element       │
  │  { "using": "css selector",       │
  │    "value": "#username" }         │
  │ ─────────────────────────────────>│
  │ <───────── elementId ─────────────│
  │  POST /session/{id}/element/{id}/click
  │ ─────────────────────────────────>│
```

**Key points:**
- Every operation — find element, click, send keys, navigate, take screenshot — maps to a defined HTTP endpoint and JSON payload/response shape.
- Before Selenium 4, Selenium used its own **JSON Wire Protocol** (a precursor, not officially standardized), which meant behavior could subtly differ between browser vendors. Selenium 4 switched to speaking **pure W3C WebDriver**, matching what browser vendors themselves implement, reducing cross-browser inconsistencies and flakiness.
- It's stateless-per-request (classic HTTP request/response), which is also *why* it's inherently slower than a persistent connection protocol like CDP/WebSocket — there's no way to push events (like a network response or console log) from browser to client without polling.

---

### 16. What changed from Selenium 3 to Selenium 4?

| Area | Selenium 3 | Selenium 4 |
|---|---|---|
| Protocol | JSON Wire Protocol, with partial/inconsistent W3C support | Pure, native W3C WebDriver protocol |
| DevTools access | Not available natively — needed third-party proxies | Native `DevTools`/CDP support via `((HasCdp) driver)` — network interception, console logs, geolocation, performance metrics |
| Locators | Standard `By` locators only | Added **Relative Locators** (`above()`, `below()`, `toLeftOf()`, `toRightOf()`, `near()`) |
| Windows/Tabs | `switchTo().window()` with handles only | New `NewWindow` API — `driver.switchTo().newWindow(WindowType.TAB)` |
| Grid | Hub-and-node architecture, manual setup, minimal UI | Fully rewritten Grid — observability dashboard, Docker support, auto-scaling-friendly, simpler standalone mode |
| Driver management | Manual download/PATH setup for chromedriver/geckodriver | **Selenium Manager** — automatically resolves and downloads the correct driver binary matching the installed browser version |
| Screenshot | Full page only via workaround | Native `getScreenshotAs()` improvements + element-level screenshots were already there, but 4 stabilizes behavior across browsers |

**Interview-ready summary:** "Selenium 4's headline changes are: full native W3C WebDriver compliance (less flakiness across browsers), built-in DevTools/CDP integration so you don't need a proxy for network mocking, relative locators, a modernized Grid, and Selenium Manager, which finally kills the manual chromedriver-version-matching headache."

---

### 17. Does Selenium 4 still use ChromeDriver?

Yes. Selenium 4 still requires a browser-specific driver executable (`chromedriver` for Chrome, `geckodriver` for Firefox, `msedgedriver` for Edge) sitting between the client bindings and the browser — that part of the architecture hasn't changed. What *has* changed is:

- You typically no longer need to manually download it and set `System.setProperty("webdriver.chrome.driver", "...")` — **Selenium Manager** (bundled since 4.6) auto-detects your installed Chrome version and downloads/caches the matching chromedriver binary transparently.
- The *protocol* chromedriver speaks to Selenium is now pure W3C WebDriver rather than the older JSON Wire Protocol.
- Internally, chromedriver itself has always used CDP to actually drive Chrome — Selenium 4 just exposes a slice of that CDP access directly to your test code, in addition to chromedriver still doing its translation job underneath.

So: driver executable — still there and still required; how you obtain/configure it, and the protocol used to talk to it — both modernized.

---

### 18. Selenium 4 vs Playwright — explain the architectural difference.

| Dimension | Selenium 4 | Playwright |
|---|---|---|
| Communication protocol | W3C WebDriver over HTTP (request/response per command) | Native browser protocols (CDP for Chromium, patched protocols for Firefox/WebKit) over a persistent WebSocket |
| Driver requirement | Separate driver executable per browser (chromedriver, geckodriver, msedgedriver) | No separate driver executable — browser binaries Playwright installs already speak the required protocol |
| Waiting model | Manual/explicit waits (`WebDriverWait`) + limited implicit wait | Built-in auto-waiting on every action |
| Isolation for parallelism | New browser/driver session generally needed | Multiple `BrowserContext`s from one `Browser` process — cheap and fast |
| Network interception | Requires external proxy or the newer CDP integration | Native `page.route()` / `page.waitForResponse()` |
| Event model | Request/response only — no native push events | Bi-directional — browser can push events (console, network, dialogs) to the client in real time |
| Language binding consistency | Each language binding independently implements W3C protocol client | All bindings talk to the same underlying Node.js driver process, so feature parity is stronger |
| Cross-browser engines | Real Chrome/Firefox/Edge/Safari via their vendor drivers | Chromium/Firefox/WebKit engines (patched builds), not the literal shipped consumer browsers in Firefox/WebKit's case |

```
Selenium 4:
Test → W3C WebDriver (HTTP) → Browser Driver (chromedriver) → Browser

Playwright:
Test → Playwright Driver → WebSocket → CDP/native protocol → Browser
```

> **Interview-ready summary:** "The core architectural split is protocol and connection model — Selenium goes through a separate driver process using stateless HTTP request/response per W3C WebDriver, while Playwright talks almost directly to the browser engine over one persistent WebSocket using native protocols like CDP. That single difference cascades into everything else: Playwright's auto-waiting, native network interception, and cheap context-based parallelism all exist *because* of that persistent, bi-directional connection — things that are structurally harder to bolt onto WebDriver's request/response model."

---

### 19. Write a JavaScript program to find duplicate characters in a string.

```javascript
/**
 * Finds all characters that appear more than once in a string,
 * along with their occurrence count.
 * @param {string} str
 * @returns {Object} map of duplicate character -> count
 */
function findDuplicateCharacters(str) {
  const charCount = {};

  // Step 1: count occurrences of every character
  for (const ch of str) {
    if (ch === ' ') continue; // skip spaces, adjust as needed
    charCount[ch] = (charCount[ch] || 0) + 1;
  }

  // Step 2: filter down to characters that occurred more than once
  const duplicates = {};
  for (const [ch, count] of Object.entries(charCount)) {
    if (count > 1) {
      duplicates[ch] = count;
    }
  }

  return duplicates;
}

// Example usage
const input = "programming";
console.log(findDuplicateCharacters(input));
// Output: { r: 2, g: 2, m: 2 }
```

**Key points:**
- Uses a hash map (`charCount`) for O(n) time complexity instead of nested loops (O(n²)) comparing every character to every other.
- `for...of` correctly iterates Unicode code points (handles most real-world strings better than indexing by `str[i]` for edge cases like surrogate pairs).
- Easy to extend: case-insensitive comparison (`str.toLowerCase()` before counting), or returning just an array of duplicate characters (`Object.keys(duplicates)`) if counts aren't needed.
- Alternative one-liner using `Array.prototype.reduce` for the same result if the interviewer wants a more "functional" style:

```javascript
const findDuplicates = str =>
  Object.entries(
    [...str].reduce((acc, ch) => ({ ...acc, [ch]: (acc[ch] || 0) + 1 }), {})
  ).filter(([, count]) => count > 1);
```

---

> **Interviewer's real test:** knowing Selenium/Playwright syntax isn't enough — be ready for "you know the tool, now explain what happens internally." That means architecture, protocols (W3C WebDriver, CDP/WebSocket), synchronization internals, and framework design decisions, not just API calls.

---

## 11. EPAM Gurugram — Interview Questions (Medium + Hard, 50% Hike)

*Recently shared EPAM Gurugram interview questions across two 90-minute virtual rounds, rated Medium + Hard difficulty, for a role offering a 50% hike. Round 1 covers Java, Selenium 4, and REST Assured/Postman fundamentals; Round 2 covers Cucumber/BDD, CI/CD, logging, Git, Agile process, SQL, and Java 8 streams.*

---

## Round 1 (Virtual): 1 Hour 30 Minutes

### 1. WAP to find last non repeating character from a string

Count frequency of every character in one pass, then walk the string from the right and return the first character whose count is 1 — that gives the *last* non-repeating character (not the first).

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class LastNonRepeatingChar {

    public static Character findLastNonRepeatingChar(String input) {
        Map<Character, Integer> countMap = new LinkedHashMap<>();
        for (char c : input.toCharArray()) {
            countMap.merge(c, 1, Integer::sum);
        }

        // Scan from the end so the first count==1 hit is the LAST non-repeating char
        for (int i = input.length() - 1; i >= 0; i--) {
            char c = input.charAt(i);
            if (countMap.get(c) == 1) {
                return c;
            }
        }
        return null; // no non-repeating character exists
    }

    public static void main(String[] args) {
        System.out.println(findLastNonRepeatingChar("swiss"));     // i
        System.out.println(findLastNonRepeatingChar("aabbcc"));    // null
        System.out.println(findLastNonRepeatingChar("teeter"));    // r
    }
}
```

**Key points:**
- Two linear passes → O(n) time, O(k) space where k = distinct characters.
- `LinkedHashMap`/`HashMap` both work since we only need counts, not insertion order, for the lookup — the ordering comes from the second pass over the original string.
- Edge cases: empty string (return `null` immediately or handle separately), string with all characters repeating (returns `null`), single-character string (returns that character).
- If asked for "first" non-repeating instead, just drop the reverse loop and scan left to right — a common follow-up trap in the interview.

---

### 2. Use of Comparable and Comparator, write java code

| Aspect | Comparable | Comparator |
|---|---|---|
| Package | `java.lang` | `java.util` |
| Method | `compareTo(T o)` | `compare(T o1, T o2)` |
| Sorting logic location | Inside the class itself | External class or lambda |
| Number of sort sequences | Only one — the "natural ordering" | Multiple — as many comparators as needed |
| Modifies original class | Yes, class must implement it | No, class stays untouched |
| Typical use in automation | Sorting a custom `TestResult`/`Employee` POJO by its primary field (e.g., id) | Sorting the same POJO by different fields on demand (name, date, priority) at runtime |

```java
import java.util.*;

class Employee implements Comparable<Employee> {
    String name;
    int age;
    double salary;

    Employee(String name, int age, double salary) {
        this.name = name;
        this.age = age;
        this.salary = salary;
    }

    // Natural ordering — by age
    @Override
    public int compareTo(Employee other) {
        return Integer.compare(this.age, other.age);
    }

    @Override
    public String toString() {
        return name + "(" + age + ", " + salary + ")";
    }
}

public class ComparableComparatorDemo {
    public static void main(String[] args) {
        List<Employee> employees = new ArrayList<>(List.of(
            new Employee("Ravi", 35, 75000),
            new Employee("Anita", 28, 90000),
            new Employee("Suresh", 42, 60000)
        ));

        Collections.sort(employees); // uses Comparable -> sorted by age
        System.out.println("By age (Comparable): " + employees);

        employees.sort(Comparator.comparingDouble((Employee e) -> e.salary).reversed());
        System.out.println("By salary desc (Comparator): " + employees);

        employees.sort(Comparator.comparing((Employee e) -> e.name).thenComparingInt(e -> e.age));
        System.out.println("By name, then age (chained Comparator): " + employees);
    }
}
```

**Interview-ready summary:** Comparable defines one default sort order baked into the class; Comparator lets you define as many external, swappable sort orders as you need without touching the class — in a framework, all custom sort logic for reports/test data goes through Comparator so the POJO stays clean.

---

### 3. Selenium 4 New Features explain

- **Fully W3C WebDriver compliant** — earlier versions translated JSON Wire Protocol to W3C at the driver level (extra hop); Selenium 4 talks W3C directly to the browser, so behaviour matches manual testing more closely.
- **Relative locators** — locate elements relative to another element: `above()`, `below()`, `toLeftOf()`, `toRightOf()`, `near()`.
  ```java
  WebElement password = driver.findElement(By.id("password"));
  WebElement email = driver.findElement(RelativeLocator.with(By.tagName("input")).above(password));
  ```
- **Native Chrome DevTools Protocol (CDP) support** — network interception, geolocation override, console log capture, and performance metrics via `DevTools` object without a third-party CDP library.
- **Improved multi-window/tab management** — `driver.switchTo().newWindow(WindowType.TAB)` and `WindowType.WINDOW` open new tabs/windows directly.
- **Selenium Manager** (from 4.6) — automatically resolves and downloads the correct browser driver binary, removing the need for WebDriverManager in most cases.
- **Selenium Grid 4** — rearchitected with Hub-less, fully distributed mode, built-in observability (tracing), and native Docker support for spinning up nodes on demand.
- **New Actions API** — cleaner, more granular control over keyboard/mouse/pointer/wheel actions, including multi-touch/pointer input devices.
- **Element screenshot** — `WebElement.getScreenshotAs()` captures just that element instead of the whole viewport.

**Interview-ready summary:** Selenium 4 is about protocol correctness (native W3C, CDP) and reduced framework overhead (Selenium Manager, relative locators, native tab handling) — most of it removes third-party workarounds teams had built around Selenium 3.

---

### 4. Difference between page object vs Page factory

| Aspect | Page Object Model (POM) | Page Factory |
|---|---|---|
| What it is | A design pattern | An extension/implementation of POM provided by Selenium |
| Element initialization | `driver.findElement()` called explicitly, usually inside each method | `@FindBy` annotations + `PageFactory.initElements()` |
| When elements are located | On every call to `findElement` (eager, each time method executes) | Lazily — elements are proxied and only actually located when first used (with caveats below) |
| Caching | No caching by default | Elements are cached only if `@CacheLookup` is used |
| Code readability | More boilerplate, more explicit | Cleaner, annotation-driven, less code |
| Stale element handling | Have to re-find manually | Proxy re-locates automatically on each interaction unless `@CacheLookup` is applied |

```java
// Page Factory style
public class LoginPage {
    WebDriver driver;

    @FindBy(id = "username")
    WebElement username;

    @FindBy(id = "password")
    WebElement password;

    @FindBy(id = "loginBtn")
    WebElement loginBtn;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    public void login(String user, String pass) {
        username.sendKeys(user);
        password.sendKeys(pass);
        loginBtn.click();
    }
}
```

**Interview-ready summary:** Page Factory is Selenium's own flavour of the Page Object pattern — same intent (encapsulate page elements/actions), but element declaration is annotation-based and proxy-backed instead of hand-written `findElement` calls.

---

### 5. Meaning of :: in java streams?

`::` is the **method reference operator**, introduced in Java 8 as shorthand for a lambda that just calls an existing method. There are four forms:

```java
// 1. Static method reference
Function<String, Integer> f1 = Integer::parseInt;          // s -> Integer.parseInt(s)

// 2. Instance method reference on a particular object
String prefix = "Test-";
Function<String, String> f2 = prefix::concat;               // s -> prefix.concat(s)

// 3. Instance method reference on an arbitrary object of a particular type
Function<String, Integer> f3 = String::length;               // s -> s.length()

// 4. Constructor reference
Supplier<ArrayList<String>> f4 = ArrayList::new;              // () -> new ArrayList<>()
```

In a stream pipeline it's purely syntactic sugar for readability:
```java
list.stream().map(String::trim).forEach(System.out::println);
```

**Key points:** compiles down to the same functional interface implementation as an equivalent lambda; used heavily in automation for things like `elements.stream().map(WebElement::getText)`.

---

### 6. Where have you used java streams in your framework?

- Converting `List<WebElement>` to `List<String>` in one line: `elements.stream().map(WebElement::getText).collect(Collectors.toList())`.
- Filtering test data rows read from Excel/JSON/DB before feeding a `@DataProvider`, e.g. `records.stream().filter(r -> r.get("env").equals("QA")).toList()`.
- Deduplicating and sorting broken-link results before writing them to the report.
- Building dynamic Extent Report summaries — grouping `ExtentTest` results by status using `Collectors.groupingBy`.
- Validating REST Assured response arrays, e.g. `response.jsonPath().getList("price", Double.class).stream().allMatch(p -> p > 0)`.
- Reading config/property values and mapping them into a `Map<String,String>` via `Collectors.toMap`.
- Parallelizing independent checks (like the broken-link checker) with `parallelStream()` when order doesn't matter and operations are I/O-bound but short-lived.

---

### 7. How you will handle elements which are inside shadow dom

Selenium 4 added native shadow DOM support via `getShadowRoot()` on the host `WebElement`; for older versions or nested/closed shadow roots, JavaScript is the fallback.

```java
// Native Selenium 4 approach (works for open shadow roots)
WebElement host = driver.findElement(By.cssSelector("custom-search-bar"));
SearchContext shadowRoot = host.getShadowRoot();
WebElement input = shadowRoot.findElement(By.cssSelector("input#search"));
input.sendKeys("Playwright");

// JavaScript fallback (also handles nested shadow DOM)
JavascriptExecutor js = (JavascriptExecutor) driver;
WebElement shadowHost = driver.findElement(By.cssSelector("custom-search-bar"));
WebElement shadowInput = (WebElement) js.executeScript(
    "return arguments[0].shadowRoot.querySelector('input#search')", shadowHost);
shadowInput.sendKeys("Playwright");
```

**Key points:** `getShadowRoot()` throws if the shadow root is `closed` mode — in that case only JS injected from the page's own context (not from outside) can traverse it, so a closed shadow root is generally untestable purely from Selenium and needs app-level cooperation (e.g., exposing a test hook).

---

### 8. How to throw custom exception in java.

```java
// 1. Define the custom exception
public class ElementNotInteractableAppException extends RuntimeException {
    public ElementNotInteractableAppException(String message) {
        super(message);
    }

    public ElementNotInteractableAppException(String message, Throwable cause) {
        super(message, cause);
    }
}

// 2. Throw it from framework code
public class LoginPage {
    public void clickLogin(WebElement loginBtn) {
        if (!loginBtn.isEnabled()) {
            throw new ElementNotInteractableAppException("Login button is disabled — cannot proceed with login");
        }
        loginBtn.click();
    }
}

// 3. Handle it at the call site
try {
    loginPage.clickLogin(loginBtn);
} catch (ElementNotInteractableAppException e) {
    logger.error("Custom exception caught: {}", e.getMessage());
    throw e; // rethrow so the test still fails
}
```

**Key points:** extend `RuntimeException` (unchecked) for framework/assertion-style failures so callers aren't forced to `throws`/`catch` everywhere; extend `Exception` (checked) only if you want to force callers to explicitly handle it. Always preserve the original cause via the `(message, cause)` constructor for stack-trace continuity.

---

### 9. Write selenium code to handle multiple windows.

```java
import org.openqa.selenium.*;
import java.util.Iterator;
import java.util.Set;

public class MultipleWindowsDemo {
    public static void handleWindows(WebDriver driver) {
        String parentWindow = driver.getWindowHandle();

        driver.findElement(By.linkText("Open New Tab")).click();

        Set<String> allWindows = driver.getWindowHandles();
        Iterator<String> it = allWindows.iterator();

        while (it.hasNext()) {
            String handle = it.next();
            if (!handle.equals(parentWindow)) {
                driver.switchTo().window(handle);
                System.out.println("Child window title: " + driver.getTitle());
                // do work in the child window
                driver.close(); // close only this child window
            }
        }

        driver.switchTo().window(parentWindow); // back to parent
    }
}
```

**Key points:** `getWindowHandles()` returns a `Set<String>` (unordered) — never assume order, always compare against the stored parent handle. Close child windows with `driver.close()`, and only call `driver.quit()` at the very end to close the whole browser/session. In Selenium 4 you can also proactively open a tab with `driver.switchTo().newWindow(WindowType.TAB)`.

---

### 10. Implement Serialization and deserialization. Write code on the Editor provided during interview

```java
import java.io.*;

class TestResult implements Serializable {
    private static final long serialVersionUID = 1L;

    private String testName;
    private String status;
    private transient long executionStartTimeMs; // excluded from serialization

    public TestResult(String testName, String status, long executionStartTimeMs) {
        this.testName = testName;
        this.status = status;
        this.executionStartTimeMs = executionStartTimeMs;
    }

    @Override
    public String toString() {
        return "TestResult{testName='" + testName + "', status='" + status
                + "', executionStartTimeMs=" + executionStartTimeMs + "}";
    }
}

public class SerializationDemo {
    public static void main(String[] args) throws IOException, ClassNotFoundException {
        TestResult result = new TestResult("LoginTest", "PASSED", System.currentTimeMillis());

        // Serialize -> write object to file
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("result.ser"))) {
            oos.writeObject(result);
        }

        // Deserialize -> read object back from file
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("result.ser"))) {
            TestResult restored = (TestResult) ois.readObject();
            System.out.println("Restored: " + restored);
            // executionStartTimeMs will print as 0 because it was marked transient
        }
    }
}
```

**Key points:** class must implement `Serializable` (a marker interface, no methods); declare a `serialVersionUID` to control version compatibility across class changes; fields marked `transient` are skipped during serialization (useful for non-serializable fields like sockets/threads or sensitive data); reading requires casting the `Object` back and catching `ClassNotFoundException`.

---

### 11. Implement oops concept for a Savings BANK

```java
// Encapsulation + inheritance + polymorphism + abstraction in one mini design

abstract class Account {
    protected String accountNumber;
    protected double balance;

    public Account(String accountNumber, double balance) {
        this.accountNumber = accountNumber;
        this.balance = balance;
    }

    public abstract double calculateInterest(); // abstraction — each account type defines its own

    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Deposit amount must be positive");
        balance += amount;
    }

    public void withdraw(double amount) {
        if (amount > balance) throw new IllegalStateException("Insufficient balance");
        balance -= amount;
    }

    public double getBalance() { // encapsulation — balance is never exposed directly
        return balance;
    }
}

class SavingsAccount extends Account {
    private static final double INTEREST_RATE = 0.04; // 4% p.a.
    private static final double MIN_BALANCE = 1000;

    public SavingsAccount(String accountNumber, double balance) {
        super(accountNumber, balance);
    }

    @Override
    public double calculateInterest() {
        return balance * INTEREST_RATE;
    }

    @Override
    public void withdraw(double amount) {
        if (balance - amount < MIN_BALANCE) {
            throw new IllegalStateException("Withdrawal breaches minimum balance of " + MIN_BALANCE);
        }
        super.withdraw(amount);
    }
}

public class SavingsBankDemo {
    public static void main(String[] args) {
        Account acc = new SavingsAccount("SB1001", 5000); // polymorphism — reference type Account
        acc.deposit(2000);
        acc.withdraw(1000);
        System.out.println("Balance: " + acc.getBalance());
        System.out.println("Interest: " + acc.calculateInterest());
    }
}
```

**Key points:** demonstrates all four pillars — encapsulation (private/protected fields with controlled access), abstraction (`abstract` class + method), inheritance (`SavingsAccount extends Account`), and polymorphism (`Account acc = new SavingsAccount(...)`, and overriding `withdraw`/`calculateInterest`). Business rules (minimum balance, interest rate) live in the subclass, keeping the base class generic.

---

### 12. What is Page Factory Design Pattern?

Page Factory is Selenium's built-in implementation of the Page Object pattern that uses annotations and reflection/proxy objects instead of manual `findElement` calls.

- `@FindBy(id/name/css/xpath = "...")` declares the locator on a `WebElement` field.
- `PageFactory.initElements(driver, this)` scans the class for `@FindBy` fields and initializes each one as a dynamic proxy.
- Elements are **lazily located** — the proxy doesn't call `findElement` until the field is actually used (a method is invoked on it), which avoids `NoSuchElementException` at object-construction time for elements not yet rendered.
- `@CacheLookup` can be added to cache the element after first lookup — use only for static elements that never go stale (e.g., a page header), never for elements inside dynamically re-rendered sections.

```java
public class HomePage {
    @FindBy(id = "search-box")
    private WebElement searchBox;

    @FindBy(css = ".search-btn")
    @CacheLookup
    private WebElement searchBtn; // safe to cache — always present, never re-rendered

    public HomePage(WebDriver driver) {
        PageFactory.initElements(driver, this);
    }

    public void search(String term) {
        searchBox.sendKeys(term);
        searchBtn.click();
    }
}
```

**Interview-ready summary:** Page Factory trades a bit of "magic" (proxies via reflection) for a cleaner, declarative way to define page elements, with lazy initialization and optional caching built in.

---

### 13. What is singleton design pattern?

Ensures a class has exactly **one instance** for the entire JVM/application lifetime and provides a global point of access to it. In automation, the most common use is a thread-safe WebDriver manager so every page object/step definition shares the same driver instance.

```java
public class DriverManager {
    private static volatile WebDriver driver;

    private DriverManager() { } // prevent external instantiation

    public static WebDriver getDriver() {
        if (driver == null) {
            synchronized (DriverManager.class) {
                if (driver == null) { // double-checked locking
                    driver = new ChromeDriver();
                }
            }
        }
        return driver;
    }

    public static void quitDriver() {
        if (driver != null) {
            driver.quit();
            driver = null;
        }
    }
}
```

**Key points:** `volatile` prevents instruction reordering issues across threads; double-checked locking avoids the cost of synchronizing on every call once the instance exists. In parallel Selenium execution you typically pair this with `ThreadLocal<WebDriver>` instead of a plain static field, so "one instance per thread" rather than "one instance globally" — otherwise parallel tests would fight over the same browser.

---

### 14. Where to use LinkedList concepts in automation

- **Browser history/tab navigation simulation** — a doubly linked list models forward/back navigation naturally (each node knows its previous/next page).
- **Undo/redo stacks** in a test-data builder or in a custom retry queue, where you frequently add/remove from both ends (`LinkedList` implements `Deque`).
- **BFS/queue-based traversal** for a link-crawler/broken-link checker — `LinkedList` as a `Queue` to process pages level by level without shifting elements like an `ArrayList` would on `remove(0)`.
- **Custom retry/backoff queue** for flaky test re-runs — push failed tests to the back of a `LinkedList`, pop from the front, up to a max retry count.
- Generally: whenever the framework does frequent insertions/deletions at the head/tail rather than random-access reads, `LinkedList` (O(1) add/remove at ends) beats `ArrayList` (O(n) shift cost); for read-heavy, index-based access `ArrayList` wins instead.

---

### 15. Exception hierarchy in Java

```
Throwable
├── Error                         (unchecked, JVM-level, not meant to be caught — OutOfMemoryError, StackOverflowError)
└── Exception
    ├── Checked Exceptions        (must be declared/handled — IOException, SQLException, ClassNotFoundException)
    └── RuntimeException          (unchecked — NullPointerException, ArrayIndexOutOfBoundsException,
                                    IllegalArgumentException, ClassCastException, ArithmeticException)
```

- `Throwable` is the root of everything catchable.
- `Error` represents conditions an application generally shouldn't try to recover from (JVM/system-level failures).
- `Exception` splits into **checked** (compiler forces `try/catch` or `throws`) and **unchecked/`RuntimeException`** (compiler doesn't force handling — usually programming bugs).
- Custom exceptions typically extend `RuntimeException` in test frameworks to avoid polluting every calling method with `throws`.

**Interview-ready summary:** Everything catchable extends `Throwable`; `Error` is for the JVM, `Exception` is for the application, and within `Exception`, `RuntimeException` is the unchecked branch — that single distinction (checked vs unchecked) is what interviewers are really testing.

---

### 16. Checked exception examples

- `IOException` — file/network I/O failures (reading a properties/Excel file in the framework).
- `SQLException` — database connectivity/query errors when validating DB assertions.
- `ClassNotFoundException` — thrown by `Class.forName()`, e.g., loading a JDBC driver class explicitly.
- `InterruptedException` — thrown when a thread is interrupted while waiting/sleeping (`Thread.sleep()`).
- `ParseException` — parsing malformed date/text via `SimpleDateFormat.parse()`.
- `TimeoutException` (the `java.util.concurrent` one) — waiting on a `Future.get(timeout)` that doesn't complete in time.

All of these must be either caught or declared with `throws` — the compiler enforces it, which is the defining trait of a checked exception.

---

### 17. Fail Safe and Fail Fast iterators in Java? Tell difference

| Aspect | Fail-Fast | Fail-Safe |
|---|---|---|
| Behavior on concurrent modification | Throws `ConcurrentModificationException` immediately | Does not throw; iterates over a snapshot/copy |
| Works on | `ArrayList`, `HashMap`, `HashSet` (java.util) | `CopyOnWriteArrayList`, `ConcurrentHashMap` (java.util.concurrent) |
| Mechanism | Uses an internal `modCount`; iterator checks it on every `next()` | Iterates a cloned/versioned data structure, original can be modified freely |
| Memory overhead | Low — no copy | Higher — a copy/snapshot is maintained |
| Data consistency | Always reflects the latest state (until it throws) | May not reflect the very latest updates made during iteration |

```java
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

public class FailFastFailSafeDemo {
    public static void main(String[] args) {
        // Fail-Fast
        List<String> arrayList = new ArrayList<>(List.of("a", "b", "c"));
        try {
            for (String s : arrayList) {
                if (s.equals("b")) arrayList.remove(s); // structural modification during iteration
            }
        } catch (ConcurrentModificationException e) {
            System.out.println("Fail-Fast: ConcurrentModificationException thrown");
        }

        // Fail-Safe
        List<String> cowList = new CopyOnWriteArrayList<>(List.of("a", "b", "c"));
        for (String s : cowList) {
            if (s.equals("b")) cowList.remove(s); // safe, iterates over snapshot taken at loop start
        }
        System.out.println("Fail-Safe result: " + cowList); // [a, c]
    }
}
```

**Interview-ready summary:** Fail-fast trades safety for immediacy — it tells you the moment your data was mutated mid-iteration; fail-safe trades consistency for stability — it never throws but may show you slightly stale data.

---

### 18. When to use ConcurrentHashMap?

Use `ConcurrentHashMap` whenever multiple threads read and write a shared map concurrently and you need thread safety **without** locking the entire map (unlike `Collections.synchronizedMap`, which locks the whole structure on every operation).

- **Parallel test execution** — sharing a common results/counter map across TestNG/JUnit threads (e.g., `Map<String, AtomicInteger>` tracking pass/fail counts per module) without external synchronization.
- **Caching driver instances or config values** keyed by thread name/test class when doing multi-threaded execution.
- Internally it uses **segment/bucket-level locking** (Java 8+ uses CAS + synchronized on bins), so reads are largely lock-free and writes only lock the affected bucket, giving far better throughput than a fully synchronized map under contention.
- It also has fail-safe iterators (see previous answer), so you can safely iterate it from a reporting thread while test threads keep updating it.

Avoid it when you don't have concurrent access at all — it has overhead a plain `HashMap` doesn't need for single-threaded code.

---

### 19. What is ObjectMapper in REST ASSURED?

`ObjectMapper` isn't a REST Assured class itself — it's Jackson's class (`com.fasterxml.jackson.databind.ObjectMapper`) that REST Assured uses under the hood (or you use directly) to convert between JSON and Java POJOs, so you serialize a request body from an object and deserialize a response into an object instead of hand-building JSON strings.

```java
class User {
    public String name;
    public String job;
    // getters/setters or public fields
}

@Test
public void createUser() throws JsonProcessingException {
    ObjectMapper objectMapper = new ObjectMapper();

    User user = new User();
    user.name = "Sriram";
    user.job = "SDET";

    String requestBody = objectMapper.writeValueAsString(user); // POJO -> JSON

    Response response = given()
            .contentType(ContentType.JSON)
            .body(requestBody)
        .when()
            .post("https://reqres.in/api/users")
        .then()
            .statusCode(201)
            .extract().response();

    User createdUser = objectMapper.readValue(response.asString(), User.class); // JSON -> POJO
    System.out.println(createdUser.name);
}
```

Alternatively, REST Assured does this automatically if you pass/expect a POJO directly: `given().body(user)...` and `.as(User.class)` — it picks Jackson (or Gson) off the classpath as the default `ObjectMapper` implementation.

**Key points:** keeps API tests type-safe and avoids brittle string concatenation for JSON payloads; POJO field names must match JSON keys (or be annotated with `@JsonProperty` when they differ).

---

### 20. Meaning of 405 status code in Postman, what does it means and how to resolve it?

**405 Method Not Allowed** means the server recognizes the resource/endpoint (URL) but the HTTP method used (GET/POST/PUT/DELETE) isn't supported for it — e.g., you sent a `POST` to an endpoint that only accepts `GET`.

**How to resolve:**
1. Check the API documentation/Swagger for the exact HTTP method the endpoint expects, and correct it in Postman/REST Assured.
2. Check the URL itself — sometimes a 405 is actually caused by hitting a slightly wrong path that happens to map to a different resource supporting fewer methods.
3. Check for a trailing slash mismatch or route mapping in the backend (some frameworks treat `/users` and `/users/` differently and route to handlers with different allowed methods).
4. Inspect the response's `Allow` header — servers are supposed to return `Allow: GET, HEAD` etc. listing which methods actually are permitted on that resource; use that to fix the request.
5. If it's your own API under test, check the server-side route/controller — the method handler for that verb may simply not be implemented yet.

**Interview-ready summary:** 405 is a client-request mismatch, not a server outage — the URL is fine, the verb isn't; fix by aligning the HTTP method (and sometimes the exact path) with what the endpoint's `Allow` header/documentation specifies.

---

## Round 2: 1 Hour 30 Minutes

### 1. How to execute only regression-related tests in testNg

Tag regression tests with a TestNG `group`, then include only that group in `testng.xml` (or via the Maven Surefire plugin for CI runs).

```java
public class LoginTests {
    @Test(groups = {"regression", "smoke"})
    public void validLoginTest() { /* ... */ }

    @Test(groups = {"regression"})
    public void invalidLoginTest() { /* ... */ }

    @Test(groups = {"sanity"})
    public void quickHealthCheckTest() { /* ... */ }
}
```

```xml
<suite name="RegressionSuite">
    <test name="RegressionOnly">
        <groups>
            <run>
                <include name="regression"/>
            </run>
        </groups>
        <classes>
            <class name="com.tests.LoginTests"/>
        </classes>
    </test>
</suite>
```

Command-line override without editing the XML (handy for CI):
```bash
mvn test -Dsurefire.suiteXmlFiles=testng.xml -Dgroups=regression
```

**Key points:** a test method can belong to multiple groups (e.g., both `smoke` and `regression`); use `<exclude>` alongside `<include>` if you need to run "regression minus known-flaky" subsets.

---

### 2. How to read data from Examples table section in cucumber without Scenario Outline. Answer is: DataTable

When you're inside a plain `Scenario` (not `Scenario Outline`) and still need tabular input, you pass a **DataTable** directly in the step text instead of an `Examples:` block.

```gherkin
Scenario: Register multiple users in one go
  Given the following users need to be registered
    | name  | email                | role   |
    | Ravi  | ravi@example.com     | admin  |
    | Anita | anita@example.com    | tester |
```

```java
@Given("the following users need to be registered")
public void registerUsers(DataTable dataTable) {
    List<Map<String, String>> users = dataTable.asMaps(String.class, String.class);
    for (Map<String, String> user : users) {
        System.out.println("Registering: " + user.get("name") + " as " + user.get("role"));
        userService.register(user.get("name"), user.get("email"), user.get("role"));
    }
}
```

**Key points:** `DataTable` can be converted via `asMaps()`, `asList()`, `asLists()`, or mapped directly to a custom POJO list with a registered `TypeRegistryConfigurer`. Unlike `Examples:` (which re-runs the *entire scenario* once per row), a `DataTable` runs the scenario **once**, with the whole table handed to a single step — useful when the rows represent one batch of related data rather than independent test iterations.

---

### 3. How to perform parallel execution in Cucumber framework

Two common approaches depending on the runner:

**A) Cucumber + JUnit Platform Suite (modern approach)** — via `junit-platform.properties`:
```properties
cucumber.execution.parallel.enabled=true
cucumber.execution.parallel.config.strategy=dynamic
cucumber.execution.parallel.config.dynamic.factor=1.0
```
```java
@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("features")
@ConfigurationParameter(key = GLUE_PROPERTY_NAME, value = "com.stepdefs")
public class RunCucumberTest { }
```

**B) Cucumber + TestNG runner** — each `.feature` file (or scenario, using the `PARALLEL_EXECUTION` plugin trick) runs on its own thread via TestNG's `dataProviderThreadCount`:
```java
@CucumberOptions(features = "src/test/resources/features", glue = "com.stepdefs")
public class TestRunner extends AbstractTestNGCucumberTests {
    @Override
    @DataProvider(parallel = true)
    public Object[][] scenarios() {
        return super.scenarios();
    }
}
```
```xml
<suite name="Suite" parallel="tests" thread-count="4" data-provider-thread-count="4">
```

**Key points:** parallel scenarios each need their **own WebDriver instance** — pair this with `ThreadLocal<WebDriver>` in the driver factory, otherwise threads will collide on a shared browser session. CI runners (Jenkins/GitHub Actions) also parallelize at the *build/fork* level by splitting feature files across multiple JVM forks via Maven Surefire's `forkCount`.

---

### 4. Conditional hooks vs directional hooks in Cucumber

"Directional" hooks are the plain `@Before`/`@After` hooks — they fire for **every** scenario, indicating only *when* (before or after) they run, not *which* scenarios they apply to. "Conditional" hooks are the same annotations restricted with a **tag expression**, so they only run *if* the scenario matches the condition.

```java
public class Hooks {

    // Directional hook — runs before EVERY scenario, no condition
    @Before
    public void setUp() {
        DriverManager.initDriver();
    }

    // Conditional hook — runs only before scenarios tagged @ui
    @Before("@ui")
    public void launchBrowser() {
        DriverManager.getDriver().get(ConfigReader.getBaseUrl());
    }

    // Conditional hook with a tag expression (AND / OR / NOT)
    @After("@ui and not @skip-screenshot")
    public void captureScreenshotOnFailure(Scenario scenario) {
        if (scenario.isFailed()) {
            byte[] screenshot = ((TakesScreenshot) DriverManager.getDriver())
                    .getScreenshotAs(OutputType.BYTES);
            scenario.attach(screenshot, "image/png", scenario.getName());
        }
    }

    // Directional hook — always runs last, tears down regardless of outcome
    @After
    public void tearDown() {
        DriverManager.quitDriver();
    }
}
```

**Interview-ready summary:** every conditional hook is technically also directional (it still runs before or after) — the distinction is whether a **tag expression** gates it. Use plain `@Before/@After` for universal setup/teardown, and tagged hooks for feature-specific behaviour like screenshot-on-failure only for UI scenarios or DB cleanup only for `@api` scenarios.

---

### 5. CI/CD Jenkins process – how to run Selenium tests

A typical declarative Jenkins pipeline for a Maven-based Selenium/TestNG or Cucumber project:

```groovy
pipeline {
    agent any

    tools {
        maven 'Maven-3.9'
        jdk 'JDK-17'
    }

    parameters {
        choice(name: 'ENV', choices: ['QA', 'STAGE'], description: 'Environment to run against')
        choice(name: 'SUITE', choices: ['smoke.xml', 'regression.xml'], description: 'TestNG suite')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/org/selenium-framework.git'
            }
        }
        stage('Build') {
            steps {
                sh 'mvn clean compile -DskipTests'
            }
        }
        stage('Run Tests') {
            steps {
                sh "mvn test -DsuiteXmlFile=${params.SUITE} -Denv=${params.ENV}"
            }
        }
        stage('Publish Reports') {
            steps {
                publishHTML(target: [
                    reportDir: 'test-output/ExtentReport',
                    reportFiles: 'index.html',
                    reportName: 'Extent Report'
                ])
                junit 'test-output/testng-results.xml'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'test-output/**', allowEmptyArchive: true
        }
        failure {
            mail to: 'team@company.com', subject: "Build ${currentBuild.fullDisplayName} failed", body: "Check Jenkins console output."
        }
    }
}
```

**Key points:** pipeline is typically triggered by a webhook (on PR merge) or a cron-style poll/schedule; browsers run **headless** on the agent (or via a Selenium Grid/Docker node) since Jenkins agents usually have no display; reports (Extent/Allure/JUnit XML) are published as post-build artifacts so results are visible without pulling logs manually.

---

### 6. Continuous Integration vs Deployment difference

| Aspect | Continuous Integration (CI) | Continuous Deployment (CD) |
|---|---|---|
| Goal | Merge and validate code changes frequently | Automatically release validated builds to production |
| Trigger | Every commit/PR | Successful CI pipeline + passing quality gates |
| Core activity | Build + run unit/integration tests + static analysis | Deploy artifact to staging/production environments |
| Human intervention | Usually none for the build/test step | Continuous **Delivery** keeps a manual approval gate before prod; Continuous **Deployment** removes even that gate and ships automatically |
| Failure impact | Blocks the merge/PR | Blocks or rolls back the release |
| Typical tools | Jenkins, GitHub Actions, GitLab CI (build/test stages) | Jenkins/Spinnaker/ArgoCD (deploy stages), often with blue-green/canary strategies |

**Interview-ready summary:** CI answers "does this change integrate and pass tests cleanly?"; CD answers "should this validated change now go live?" — Continuous Delivery keeps a manual go/no-go before production, Continuous Deployment automates that last step too.

---

### 7. Custom reporting (Extent Report and Allure) - write code

**Extent Report (ExtentReports v5, TestNG listener style):**
```java
public class ExtentManager {
    private static ExtentReports extent;

    public static ExtentReports getInstance() {
        if (extent == null) {
            ExtentSparkReporter spark = new ExtentSparkReporter("test-output/ExtentReport/index.html");
            spark.config().setDocumentTitle("Automation Report");
            spark.config().setReportName("Regression Suite");

            extent = new ExtentReports();
            extent.attachReporter(spark);
            extent.setSystemInfo("Environment", System.getProperty("env", "QA"));
        }
        return extent;
    }
}

public class ExtentTestListener implements ITestListener {
    private static ThreadLocal<ExtentTest> test = new ThreadLocal<>();
    private ExtentReports extent = ExtentManager.getInstance();

    @Override
    public void onTestStart(ITestResult result) {
        test.set(extent.createTest(result.getMethod().getMethodName()));
    }

    @Override
    public void onTestFailure(ITestResult result) {
        test.get().fail(result.getThrowable());
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        test.get().pass("Test passed");
    }

    @Override
    public void onFinish(ITestContext context) {
        extent.flush();
    }
}
```

**Allure (annotation-driven, works with TestNG/JUnit/Cucumber):**
```java
@Epic("Authentication")
@Feature("Login")
public class LoginTests {

    @Test
    @Story("Valid login")
    @Severity(SeverityLevel.CRITICAL)
    public void validLoginTest() {
        loginStep("standard_user", "secret_sauce");
        Assert.assertTrue(dashboardPage.isDisplayed());
    }

    @Step("Login with username {0} and password {1}")
    public void loginStep(String user, String pass) {
        loginPage.login(user, pass);
    }

    @Attachment(value = "Screenshot on failure", type = "image/png")
    public byte[] attachScreenshot(WebDriver driver) {
        return ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
    }
}
```
```bash
# generate and open the Allure HTML report after the run
allure serve target/allure-results
```

**Key points:** Extent needs a `ThreadLocal<ExtentTest>` for parallel runs so log entries don't bleed across threads; Allure captures step/attachment metadata via annotations during the run into `allure-results` JSON, then a separate `allure generate`/`serve` step renders the HTML — so Allure setup is mostly annotations plus a Maven/Gradle plugin, with almost no manual reporting code compared to Extent.

---

### 8. Why use logging (Log4j2) in Selenium framework

- **Debuggability** — when a test fails in CI at 2 AM, logs (not just a stack trace) tell you what the framework was doing right before the failure (which page, which locator, what data).
- **No `System.out.println` clutter** — Log4j2 gives structured, timestamped, leveled output that can be filtered by severity instead of one undifferentiated console stream.
- **Configurable verbosity without code changes** — flip from `INFO` to `DEBUG` via `log4j2.xml`/system property, no redeploy needed.
- **Multiple destinations at once** — console for local runs, rolling file for CI archives, and (via custom appenders) even push to a central log aggregator (ELK/Splunk).
- **Asynchronous logging** — Log4j2's `AsyncLogger` uses the LMAX Disruptor for high-throughput, low-latency logging, so heavy logging doesn't slow down parallel Selenium execution the way naive file I/O would.
- **Audit trail** — logs double as a lightweight execution history independent of the HTML report, useful when correlating flaky failures across runs.

---

### 9. Different log levels in Log4j2

From lowest to highest severity (each level also logs everything above it when set as the threshold):

| Level | Purpose |
|---|---|
| `TRACE` | Finest-grained detail — every method entry/exit, variable dump |
| `DEBUG` | Diagnostic info useful during development/troubleshooting |
| `INFO` | High-level flow — "Test started", "Navigating to login page" |
| `WARN` | Something unexpected but not breaking — e.g., a retry was needed |
| `ERROR` | A failure occurred, but the application/test can continue |
| `FATAL` | Severe failure — application/test cannot continue |
| `OFF` / `ALL` | Special: disable all logging / enable everything |

```java
private static final Logger logger = LogManager.getLogger(LoginTest.class);

logger.trace("Entering login method");
logger.debug("Username field located: {}", usernameLocator);
logger.info("Attempting login for user: {}", username);
logger.warn("Retrying click on login button — first attempt intercepted");
logger.error("Login failed for user: {}", username, exception);
logger.fatal("Driver could not be initialized — aborting suite");
```

Setting `<Root level="INFO">` in config means `TRACE` and `DEBUG` are suppressed but `INFO` and everything more severe still prints.

---

### 10. Use of Appenders in logging (Log4j2)

An **Appender** defines *where* a log event is written — console, file, rolling file, database, etc. Multiple appenders can be attached to the same logger so one event fans out to several destinations at once.

```xml
<Configuration status="WARN">
    <Appenders>
        <Console name="ConsoleAppender" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{HH:mm:ss} [%t] %-5level %logger{36} - %msg%n"/>
        </Console>

        <RollingFile name="FileAppender" fileName="logs/automation.log"
                     filePattern="logs/automation-%d{yyyy-MM-dd}-%i.log.gz">
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss} [%t] %-5level %logger{36} - %msg%n"/>
            <Policies>
                <TimeBasedTriggeringPolicy/>
                <SizeBasedTriggeringPolicy size="10MB"/>
            </Policies>
            <DefaultRolloverStrategy max="10"/>
        </RollingFile>
    </Appenders>

    <Loggers>
        <Root level="INFO">
            <AppenderRef ref="ConsoleAppender"/>
            <AppenderRef ref="FileAppender"/>
        </Root>
    </Loggers>
</Configuration>
```

**Key points:** `ConsoleAppender` for local dev visibility, `RollingFileAppender` for CI (auto-rotates by size/date and compresses old logs so disk doesn't fill up), and each `AppenderRef` under a `Logger`/`Root` can have its own level filter independent of the logger's own level.

---

### 11. Root cause of flakiness in Selenium scripts - how to fix, how many ways.

**Common root causes:**
1. **Synchronization issues** — script runs faster than the page/AJAX response → fix with explicit `WebDriverWait`/`FluentWait`, never `Thread.sleep()`.
2. **Dynamic/unstable locators** — auto-generated IDs or index-based XPath that shift between runs → fix with stable `data-testid` attributes or relative locators.
3. **Animations/transitions** — element is "visible" in DOM but still animating into position when clicked → wait for the animation-specific condition (e.g., CSS class change) or disable animations in the test environment.
4. **Test data collisions** — parallel tests mutating shared data (same user/record) → isolate test data per thread/run (unique emails, dedicated test accounts, DB reset between runs).
5. **Environment/network flakiness** — slow QA environment, third-party dependencies (payment gateways, CDNs) → mock external dependencies where possible, add environment health checks before the suite runs.
6. **Stale element references** — DOM re-rendered after an action but the script still holds the old reference → re-locate instead of caching, or avoid `@CacheLookup` for dynamic sections.
7. **Improper thread handling in parallel runs** — shared static WebDriver instance across threads → use `ThreadLocal<WebDriver>`.
8. **Browser/driver version mismatch** — fixed with Selenium Manager (Selenium 4.6+) or WebDriverManager auto-resolving the right driver.

**Ways to reduce it overall:** explicit waits everywhere, retry analyzer for genuinely transient failures (network blips only — not used to mask real bugs), isolated/idempotent test data, headless + fixed viewport for consistent rendering, and quarantining/tagging known-flaky tests separately from the main gating suite until fixed.

---

### 12. Explain Root Cause Analysis techniques?

- **5 Whys** — repeatedly ask "why did this happen" (typically 5 times) until you reach the true underlying cause instead of stopping at the symptom. E.g., Test failed → why? Element not found → why? Locator changed → why? Dev changed the ID → why? No contract between UI and QA on stable locators → why? No `data-testid` convention enforced — *that's* the real fix.
- **Fishbone / Ishikawa diagram** — categorize potential causes into buckets (People, Process, Tools, Environment, Data) branching off a "spine" pointing at the defect, useful for defects with many possible contributing factors rather than one obvious chain.
- **Pareto Analysis (80/20 rule)** — chart defects by category/module and frequency; fix the ~20% of root causes responsible for ~80% of the failures first (e.g., most flaky failures come from one poorly-built page).
- **Fault Tree Analysis** — a top-down, deductive tree of the failure event branching into all possible contributing conditions (AND/OR gates), more formal and used for critical/complex system failures.
- **Timeline/Change Analysis** — correlate the defect's first occurrence against a timeline of recent code/environment/config changes to isolate the triggering change (very common for flaky suite regressions).

In practice for a QA team, 5 Whys is the day-to-day tool for individual defects; Pareto is used sprint/release-over-release to prioritize where to invest fixing effort.

---

### 13. Tell me use of git cherry-pick command -- very important

`git cherry-pick <commit-hash>` applies the changes introduced by a **specific commit** from one branch onto your current branch, without merging the entire branch.

**Common real-world use:** a hotfix committed on `release/2.3` needs to also land on `main`/`develop` without pulling in every other unfinished change from the release branch.

```bash
git checkout main
git cherry-pick a1b2c3d          # apply a single commit

git cherry-pick a1b2c3d d4e5f6g  # apply multiple commits, in order

git cherry-pick a1b2c3d..d4e5f6g # apply a range of commits (exclusive of the first)

git cherry-pick -n a1b2c3d       # apply changes but don't auto-commit (stage only, review first)

git cherry-pick --continue       # after resolving a conflict during cherry-pick
git cherry-pick --abort          # bail out and restore pre-cherry-pick state
```

**Key points:** cherry-pick creates a **new commit** with a new hash on the target branch (same diff, different parent/history), so the same logical change now exists twice in history — that's fine for hotfixes but can cause confusing merge conflicts later if the same commit is later merged normally too. Conflicts are resolved exactly like a merge conflict — edit, `git add`, then `--continue`.

---

### 14. Tell me Branching strategy in Git

Most commonly discussed in interviews: **GitFlow** vs **Trunk-Based Development** vs **GitHub Flow**.

| Strategy | Branches | Best for |
|---|---|---|
| GitFlow | `main`, `develop`, `feature/*`, `release/*`, `hotfix/*` | Scheduled/versioned releases, larger teams, longer QA cycles |
| GitHub Flow | `main` + short-lived `feature/*` branches, PR + merge directly to main | Continuous deployment, smaller teams, frequent releases |
| Trunk-Based Development | Everyone commits to `main`/`trunk` frequently, feature flags hide incomplete work | High CI/CD maturity, very frequent integration |

Typical GitFlow example used at a company running scheduled releases:
```
main        -----------------●------------------●------  (production releases)
                              \                  /
release/2.3  ------●----------●
                    \
develop     ----●---●----●----●----●------●----●-------
                 \        \        \        /
feature/login  ---●--------●        \      /
feature/cart            ----●--------●----●
hotfix/2.2.1                              \--●-- (cherry-picked back to develop)
```

- `main` — always production-ready/deployed code.
- `develop` — integration branch for the next release.
- `feature/*` — one branch per story/feature, merged into `develop` via PR.
- `release/*` — cut from `develop` when feature-complete, used for stabilization/regression testing.
- `hotfix/*` — cut from `main` for urgent production fixes, merged back into both `main` and `develop`.

**Interview-ready summary:** pick GitFlow when releases are scheduled/versioned and need a stabilization window; pick trunk-based/GitHub Flow when the team ships continuously and relies on feature flags/small PRs instead of long-lived branches.

---

### 15. Estimation techniques in Agile

- **Planning Poker** — each team member privately picks a Fibonacci-scale card (1, 2, 3, 5, 8, 13...) for story points; outliers discuss and re-vote until convergence. Most common technique in Scrum teams.
- **T-Shirt Sizing** — quick relative sizing (XS/S/M/L/XL) used early in backlog grooming before detailed point estimation, good for high-level roadmap planning.
- **Bucket System** — stories are sorted into predefined point "buckets" (0,1,2,3,5,8,13,20,40,100) quickly as a group, faster than planning poker for large backlogs.
- **Affinity Estimation** — team silently places stories on a wall/board relative to each other by perceived size, then buckets are assigned point values — very fast for grooming 50+ backlog items at once.
- **Three-Point Estimation (PERT)** — Estimate = (Optimistic + 4×Most Likely + Pessimistic) / 6, useful when a task has real uncertainty and a single number would hide risk.
- **Story splitting + historical velocity** — rather than re-estimating from scratch, compare a new story to already-completed similarly-sized stories ("this is like the login story we did last sprint, so 5 points").

In practice: planning poker for sprint-level story estimation, affinity/bucket for large backlog triage, three-point for genuinely uncertain technical spikes.

---

### 16. Tell me Metrics to track project progress in Agile

- **Velocity** — story points completed per sprint, used to forecast how much can be committed in future sprints.
- **Sprint Burndown Chart** — remaining work (hours/points) per day within a sprint, shows if the team is on pace to finish.
- **Release Burnup Chart** — cumulative completed work vs total scope across the whole release, also visualizes scope creep.
- **Defect Density** — number of defects per module/story point/KLOC, flags risky areas of the codebase.
- **Escaped Defects / Defect Leakage** — bugs found post-release vs found during testing, measures testing effectiveness.
- **Cycle Time / Lead Time** — time from "work started" to "done" (cycle time) or from "requested" to "delivered" (lead time), highlights process bottlenecks.
- **Test Case Execution Status** — passed/failed/blocked/not-run counts per sprint, tracked in the test management tool (Zephyr/Xray) or a report dashboard.
- **Automation Coverage %** — proportion of test cases/regression suite automated, tracked sprint over sprint as a quality investment metric.
- **Team Happiness/Health Check** — softer metric, but commonly tracked in retros to catch burnout before it affects delivery metrics.

---

### 17. Explain Test Plan document

A Test Plan is the master document describing the **scope, approach, resources, and schedule** of testing activities for a project/release. Typical sections (IEEE 829-inspired, adapted for Agile projects):

1. **Test Plan ID & Introduction** — purpose, references to requirements/user stories.
2. **Scope** — features in scope / out of scope for this test cycle.
3. **Test Strategy reference** — link to the overarching strategy document (approach, types of testing).
4. **Test Items** — the specific builds/modules being tested.
5. **Features to be tested / not tested** — explicit inclusion/exclusion list.
6. **Test Environment** — browsers/devices/OS, environment URLs, test data requirements.
7. **Entry and Exit Criteria** — conditions to start testing (e.g., build deployed, smoke passed) and conditions to conclude (e.g., 95% pass rate, no open Sev-1/Sev-2 defects).
8. **Roles and Responsibilities** — who does functional, automation, performance, UAT sign-off.
9. **Schedule/Milestones** — testing timeline mapped to sprint/release dates.
10. **Risks and Contingencies** — e.g., environment instability, resource shortage, and mitigation plans.
11. **Deliverables** — test cases, automation scripts, defect reports, summary report.

**Interview-ready summary:** the Test Plan is project-specific and answers "what are we testing, on what environment, by when, and how do we know we're done for *this* release" — as opposed to the Test Strategy, which is broader and reusable.

---

### 18. Difference between Test Plan and Test Strategy

| Aspect | Test Plan | Test Strategy |
|---|---|---|
| Scope | Project/release-specific | Organization-wide or program-wide |
| Author | Test Lead / QA Manager for that project | Senior QA Manager / Test Architect |
| Content | Scope, schedule, resources, entry/exit criteria, environment, deliverables for THIS release | High-level testing approach, methodologies, tools, standards applicable across all/multiple projects |
| Frequency of change | Changes every release/sprint | Rarely changes — created once and reused |
| Level | Tactical/operational | Strategic |
| Example content | "Sprint 14 regression covers modules A, B; entry criteria = smoke passed on build 1.4.2" | "All API tests use REST Assured, all UI automation follows POM, all defects triaged within 24 hrs" |

**Interview-ready summary:** Test Strategy is the constitution — written once, applies broadly, rarely changes; the Test Plan is the specific law passed for this particular release, derived from and consistent with that strategy.

---

### 19. Prepare any manual test cases & explain test design techniques

**Sample manual test case:**

| Field | Value |
|---|---|
| Test Case ID | TC_LOGIN_001 |
| Title | Verify login with valid credentials |
| Preconditions | User is registered; application URL is accessible |
| Test Steps | 1. Navigate to login page 2. Enter valid username 3. Enter valid password 4. Click Login |
| Test Data | username: standard_user, password: secret_sauce |
| Expected Result | User is redirected to the dashboard page; welcome message with username is displayed |
| Actual Result | *(filled during execution)* |
| Status | Pass/Fail |
| Priority | High |

**Test design techniques used to arrive at cases like this:**
- **Equivalence Partitioning** — divide input into valid/invalid classes and test one representative from each (e.g., valid username class vs invalid-format username class) instead of testing every possible value.
- **Boundary Value Analysis** — test at the edges of a range, e.g., password field with min-length 8: test at 7, 8, 9 characters.
- **Decision Table Testing** — for business-rule-heavy features (e.g., discount eligibility based on multiple conditions), build a table of condition combinations and expected outcomes.
- **State Transition Testing** — for workflows with states (order: Placed → Shipped → Delivered → Returned), test valid and invalid state transitions.
- **Error Guessing** — based on experience, proactively test known problem areas (special characters in text fields, double form submission, back-button behavior).
- **Exploratory Testing** — unscripted, simultaneous learning/test-design/execution, used to catch what scripted cases miss, especially for new/complex features.

---

### 20. How to Calculate defect leakage

```
Defect Leakage (%) = (Defects found in later phase / Defects found in earlier phase) × 100
```

Most common real-world form — defects that escaped testing into UAT/Production:
```
Defect Leakage (%) = (Defects found post-release (UAT/Production) 
                        / Total defects found during testing) × 100
```

**Worked example:** QA found 90 defects during the test cycle; UAT/Production found 10 more that QA missed.
```
Defect Leakage = (10 / 90) × 100 = 11.1%
```

A lower percentage indicates more effective testing before release; this is tracked release-over-release as a quality trend metric, and is often broken down by module to see where test coverage is weakest.

---

### 21. Explain Defect leakage meaning

Defect leakage refers to defects that **existed during a given test phase but were not caught in that phase**, and instead "leaked" through to a later phase (e.g., from System Testing into UAT, or from UAT into Production) where they were eventually found by someone else — a user, a different test team, or an end customer.

It's fundamentally a measure of test **effectiveness**, not just of the product's quality — high defect leakage points to gaps in test coverage, missed edge cases, weak requirements understanding, or insufficient regression testing, rather than the application simply having "more bugs." It's the mirror metric to defect leakage calculation above — one is the definition, the other is how you quantify it for a report.

---

### 22. Explain Test pyramid concept

The Test Pyramid is a strategy for balancing test types by speed, cost, and quantity — more tests at the fast/cheap base, fewer at the slow/expensive top.

```
            /\
           /  \        UI / E2E Tests (few, slow, expensive, brittle)
          /----\
         /      \      API / Integration / Service Tests (moderate count, faster, more stable)
        /--------\
       /          \    Unit Tests (many, fastest, cheapest, most stable)
      /------------\
```

- **Unit tests (base, majority ~70%)** — test individual methods/classes in isolation, run in milliseconds, owned mostly by developers, cheapest to maintain.
- **Integration/API/Service tests (middle ~20%)** — test interactions between components/services (e.g., REST Assured API tests), faster and more stable than UI tests since there's no rendering/browser involved.
- **UI/E2E tests (top ~10%)** — test full user journeys through the actual browser/app, most realistic but slowest, most brittle, and most expensive to maintain — kept minimal, reserved for critical user flows.

**Interview-ready summary:** the inverted pyramid ("ice-cream cone" anti-pattern) — too many slow, flaky UI tests and too few unit/API tests — is exactly what causes long, unreliable regression suites; the fix is pushing coverage down the pyramid wherever the same risk can be verified faster at a lower layer.

---

### 23. DDL vs DML explain

| Aspect | DDL (Data Definition Language) | DML (Data Manipulation Language) |
|---|---|---|
| Purpose | Defines/modifies database structure (schema) | Manipulates the actual data within tables |
| Commands | `CREATE`, `ALTER`, `DROP`, `TRUNCATE`, `RENAME` | `INSERT`, `UPDATE`, `DELETE`, `SELECT` (sometimes classified separately as DQL) |
| Transaction behavior | Auto-commits — cannot be rolled back in most RDBMS | Can be rolled back / committed explicitly within a transaction |
| Effect | Changes table structure, constraints, indexes | Changes row-level data, doesn't touch structure |
| Automation use | Used to set up/tear down test schema (rare, mostly by DBAs/CI setup scripts) | Used constantly in test data setup/validation/cleanup |

```sql
-- DDL
CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(50), email VARCHAR(100));
ALTER TABLE users ADD COLUMN created_at TIMESTAMP;
DROP TABLE users;

-- DML
INSERT INTO users (id, name, email) VALUES (1, 'Sriram', 'sriram@example.com');
UPDATE users SET email = 'new@example.com' WHERE id = 1;
DELETE FROM users WHERE id = 1;
SELECT * FROM users WHERE name = 'Sriram';
```

**Interview-ready summary:** DDL shapes the container (the table/schema), DML fills and manages what's inside it — in test automation, you're almost always writing DML for setup/teardown/assertions and rarely touching DDL directly.

---

### 24. Use of Subqueries use in SQL

A subquery is a query nested inside another query, used when a condition depends on the result of another query rather than a static/known value.

```sql
-- Non-correlated subquery: independent of the outer query
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- Subquery in the FROM clause (derived table)
SELECT department, avg_salary
FROM (
    SELECT department, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department
) dept_avg
WHERE avg_salary > 60000;

-- Correlated subquery: references a column from the outer query, runs once per outer row
SELECT e.name, e.department, e.salary
FROM employees e
WHERE e.salary > (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.department = e.department
);

-- Subquery with IN
SELECT name FROM employees
WHERE department_id IN (SELECT id FROM departments WHERE location = 'Hyderabad');
```

**Key points:** in test automation, subqueries are common when validating aggregate business rules straight from the DB (e.g., "verify each user's order total in the app matches SUM of their order_items in the DB") without pulling all rows into Java and computing it there; correlated subqueries are slower (executed per outer row) so for large validation datasets a `JOIN` is often more efficient than a correlated subquery doing the same job.

---

### 25. Given an array of cars, capitalize all car names having length > 3, using java 8 concepts (streams), write code

```java
import java.util.*;
import java.util.stream.*;

public class CapitalizeCarNames {
    public static void main(String[] args) {
        String[] cars = {"bmw", "kia", "audi", "tesla", "bmx", "ford"};

        List<String> result = Arrays.stream(cars)
                .map(car -> car.length() > 3
                        ? car.substring(0, 1).toUpperCase() + car.substring(1)
                        : car)
                .collect(Collectors.toList());

        System.out.println(result);
        // [bmw, kia, Audi, Tesla, bmx, Ford]
    }
}
```

**Key points:** `Arrays.stream()` converts the array to a `Stream<String>`; the ternary inside `map()` leaves short names (length ≤ 3) untouched and capitalizes only the first character of longer ones by splitting into head (`substring(0,1)`) and tail (`substring(1)`); a common follow-up is to do the same fully in uppercase (`.toUpperCase()` on the whole string) instead of just the first letter — clarify with the interviewer which "capitalize" they mean before coding. Edge case: an empty string in the array would throw `StringIndexOutOfBoundsException` on `substring(0,1)` — guard with `car.isEmpty()` check if nulls/blanks are possible input.

---

### 26. Can you write method of IAnnotationTransformer interface in testNg.

`IAnnotationTransformer` lets you modify TestNG annotation attributes (like `@Test`) at runtime, without touching the test source — commonly used to inject a `RetryAnalyzer` into every test method automatically instead of adding `retryAnalyzer = RetryAnalyzer.class` on each `@Test`.

```java
import org.testng.IAnnotationTransformer;
import org.testng.annotations.ITestAnnotation;
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

public class RetryTransformer implements IAnnotationTransformer {

    @Override
    public void transform(ITestAnnotation annotation, Class testClass,
                           Constructor testConstructor, Method testMethod) {
        annotation.setRetryAnalyzer(RetryAnalyzer.class);
    }
}
```

Register it either in `testng.xml`:
```xml
<suite name="Suite">
    <listeners>
        <listener class-name="com.framework.listeners.RetryTransformer"/>
    </listeners>
    ...
</suite>
```
or via `META-INF/services/org.testng.ITestNGListener` for auto-discovery without editing the XML.

**Key points:** this runs at annotation-processing time (before tests execute), so it's the cleanest way to enforce a cross-cutting policy (retry, timeout, alwaysRun) across the whole suite from one place instead of decorating every test method manually.

---

### 27. SQL Joins explain.

| Join Type | Returns |
|---|---|
| INNER JOIN | Only matching rows in both tables |
| LEFT JOIN (LEFT OUTER) | All rows from the left table, matched rows from the right (NULLs where no match) |
| RIGHT JOIN (RIGHT OUTER) | All rows from the right table, matched rows from the left (NULLs where no match) |
| FULL OUTER JOIN | All rows from both tables, NULLs where no match on either side |
| SELF JOIN | A table joined with itself, using aliases, for hierarchical/comparative data |
| CROSS JOIN | Cartesian product — every row of table A with every row of table B |

```sql
-- INNER JOIN
SELECT o.order_id, c.name
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id;

-- LEFT JOIN — all customers, even those with no orders
SELECT c.name, o.order_id
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;

-- SELF JOIN — employees and their managers, same table
SELECT e.name AS employee, m.name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.id;

-- CROSS JOIN — pairing every size with every color for a product catalog
SELECT s.size, c.color
FROM sizes s
CROSS JOIN colors c;
```

**Interview-ready summary:** INNER keeps only the overlap, LEFT/RIGHT keep one full side plus whatever overlaps on the other, FULL OUTER keeps everything from both sides, SELF is about relating rows within one table, and CROSS ignores matching altogether and just multiplies rows — in automation, LEFT JOIN is the one most used for "verify no orphaned records" style DB validations.

---

### 28. How to test broken links in parallel way?

Collect all `<a href>` links from the page, then hit each with an HTTP `HEAD` (or `GET` as fallback) request concurrently using a thread pool, and flag any 4xx/5xx or unreachable URL.

```java
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.concurrent.*;
import java.util.stream.Collectors;

public class BrokenLinkChecker {

    public static void main(String[] args) {
        List<String> links = List.of(
                "https://example.com",
                "https://example.com/invalid-page",
                "https://example.com/about"
        );

        ExecutorService executor = Executors.newFixedThreadPool(10);

        List<Future<String>> futures = links.stream()
                .map(link -> executor.submit(() -> checkLink(link)))
                .collect(Collectors.toList());

        for (Future<String> future : futures) {
            try {
                System.out.println(future.get(10, TimeUnit.SECONDS));
            } catch (Exception e) {
                System.out.println("Error while checking link: " + e.getMessage());
            }
        }
        executor.shutdown();
    }

    private static String checkLink(String url) {
        try {
            HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
            conn.setRequestMethod("HEAD");
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);
            int statusCode = conn.getResponseCode();
            return url + " -> " + statusCode + (statusCode >= 400 ? " (BROKEN)" : " (OK)");
        } catch (Exception e) {
            return url + " -> UNREACHABLE (" + e.getMessage() + ")";
        }
    }
}
```

**Key points:** links are collected once via `driver.findElements(By.tagName("a"))` and their `href` attributes, but the actual status checks happen **outside** Selenium/the browser via plain `HttpURLConnection` (or REST Assured/Apache HttpClient) since there's no need to render the target page — this is what makes parallelizing safe and fast, since you're not juggling multiple browser instances, just concurrent HTTP calls. Use `HEAD` first for speed; some servers don't support `HEAD` properly and return a false 405/501, so fall back to `GET` for those before marking a link broken.

---
